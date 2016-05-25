function changeView() {
    var _surfaceMap = document.getElementById("surfaceMap").value;
    var surfaceMap = window.tremula.projections.xyPlain;
    switch (_surfaceMap) {
        case 'xyPlain': surfaceMap = window.tremula.projections.xyPlain; break;
        case 'streamHorizontal': surfaceMap = window.tremula.projections.streamHorizontal; break;
        case 'pinterest': surfaceMap = window.tremula.projections.pinterest; break;
        case 'mountain': surfaceMap = window.tremula.projections.mountain; break;
        case 'turntable': surfaceMap = window.tremula.projections.turntable; break;
        case 'enterTheDragon': surfaceMap = window.tremula.projections.enterTheDragon; break;
    }
    window.tremula.Grid.updateConfig({ surfaceMap: surfaceMap }, true);
}

function createTremula() {

    var wHeight = window.innerHeight;

    // .tremulaContainer must exist and have actual dimentionality 
    // requires display:block with an explicitly defined H & W
    $tremulaContainer = $('.tremulaContainer');

    //this creates a hook to a new Tremula instance
    var tremula = new Tremula();


    //Create a config object -- this is how most default behaivior is set.
    //see updateConfig(prop_val_object,refreshStreamFlag) method to change properties of a running instance
    var config = {

        //Size of the static axis in pixels
        //If your scroll axis is set to 'x' then this will be the normalized height of your content blocks.
        //If your scroll axis is set to 'y' then this will be the normalized width of your content blocks.
        itemConstraint: 250,//px

        //Margin in px added to each side of each content item
        itemMargins: [20, 10],//x (left & right), y (top & bottom) in px

        //Display offset of static axis (static axis is the non-scrolling dimention)
        staticAxisOffset: 0,//px

        //Display offset of scroll axis (this is the amount of scrollable area added before the first content block)
        scrollAxisOffset: 20,//px

        //Sets the scroll axis 'x'|'y'.
        //NOTE: projections generally only work with one scroll axis
        //when changeing this value, make sure to use a compatible projection
        scrollAxis: 'x',//'x'|'y'

        //surfaceMap is the projection/3d-effect which will be used to display grid content
        //following is a list of built-in projections with their corresponding scroll direction
        //NOTE: Using a projection with an incompatible Grid or Grid-Direction will result in-not-so awesome results
        //----------------------
        // (x or y) xyPlain
        // (x) streamHorizontal
        // (y) pinterest
        // (x) mountain
        // (x) turntable
        // (x) enterTheDragon
        // (x) userProjection  <-- 
        //----------------------
        surfaceMap: tremula.projections.streamHorizontal, //mountain,//userProjection,

        //how many rows (or colums) to display.  note: this is zero based -- so a value of 0 means there will be one row/column
        staticAxisCount: (wHeight > 1000) ? 
            2 : 
            (wHeight > 600) ? 
                1 : 
                0,//zero based 

        //the grid that will be used to project content
        //NOTE: Generally, this will stay the same and various surface map projections
        //will be used to create various 3d positioning effects
        defaultLayout: tremula.layouts.xyPlain,

        //it does not look like this actually got implemented so, don't worry about it ;)
        itemPreloading: true,

        //enables the item-level momentum envelope
        itemEasing: false,

        //enables looping with the current seet of results
        isLooping: false,

        //if item-level easing is enabled, it will use the following parameters
        //NOTE: this is experimental. This effect can make people queasy.
        itemEasingParams: {
            touchCurve: tremula.easings.easeOutCubic,
            swipeCurve: tremula.easings.easeOutCubic,
            transitionCurve: tremula.easings.easeOutElastic,
            easeTime: 500,
            springLimit: 40 //in px
        },

        //method called after each frame is painted. Passes internal parameter object.
        //see fn definition below
        onChangePub: doScrollEvents,

        //content/stream data can optionally be passed in on init()
        data: null,

        // lastContentBlock enables a persistant content block to exist at the end of the stream at all times.
        // Common use case is to target $('.lastContentItem') with a conditional loading spinner when API is churning.
        lastContentBlock: {
            template: '<div class="lastContentItem"></div>',
            layoutType: 'tremulaBlockItem',
            noScaling: true,
            w: 300,
            h: 300,
            isLastContentBlock: true,
            adapter: tremula.dataAdapters.TremulaItem
        },

        //dafault data adapter method which is called on each data item -- this is used if none is supplied during an import operation
        //enables easy adaptation of arbitrary API data formats -- see flickr example
        adapter: null

    };

    //initalize the tremula instance with 3 parameters: 
    //a DOM container, a config object, and a parent context
    tremula.init($tremulaContainer, config, this);

    //return the tremula hook 
    return tremula;
}

//This method is called on each paint frame thus enabling low level behaivior control
//it receives a single parameter object of internal instance states
//NOTE: below is a simple example of infinate scrolling where new item
//requests are made when the user scrolls past the existing 70% mark.
//
//Another option here is multiple tremula instancechaining i.e. follow the scroll events of another tremula instance.
//use case of this may be one tremula displaying close up data view while another may be an overview.
function doScrollEvents(o) {
    /*
        if(o.scrollProgress>.7){
          if(!tremula.cache.endOfScrollFlag){
            tremula.cache.endOfScrollFlag = true;
            pageCtr++;
            loadFlickr();
            console.log('END OF SCROLL!')
          }
        }
    */
};


//Basic example of API integration
//=================================
//DATA FUNCTIONS OF NOTE: 
//tremula.refreshData(returned_set_array,dataAdapter)//replaces current data set with returned_set_array
//tremula.appendData(returned_set_array,dataAdapter)//appends current data set with returned_set_array
//tremula.insertData(returned_set_array,dataAdapter)//prepends current data set with returned_set_array
//=================================
/* SIZE SUFFIX FOR FLICKR IMAGE URLS ===> must be set in method below also
s	small square 75x75
q	large square 150x150
t	thumbnail, 100 on longest side
m	small, 240 on longest side
n	small, 320 on longest side
-	medium, 500 on longest side
z	medium 640, 640 on longest side
c	medium 800, 800 on longest side†
b	large, 1024 on longest side*
o	original image, either a jpg, gif or png, depending on source format
*/
var pageCtr = 1;
function loadFlickr() {
    var rs = [
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/1.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/2.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/3.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 2600 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/4.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/5.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/6.jpg', title: 'Кухонное стеклянное панно из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/7.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/8.jpg', title: 'Кухонное стеклянное панно из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/9.jpg', title: 'Кухонное стеклянное панно из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/10.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/11.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/12.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/13.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/14.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/15.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/16.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/17.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/18.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/19.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/20.jpg', title: 'Фартук для кухни из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/21.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/22.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/23.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/24.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/25.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/26.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/27.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/28.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/29.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/30.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/31.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/32.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/33.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/34.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/35.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/36.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/37.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/38.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/39.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/40.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/41.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/42.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/43.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/44.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/45.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/46.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/47.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/48.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/49.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/50.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/51.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/52.jpg', title: 'Стеклянный кухонный фартук' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/53.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/54.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/55.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/56.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/57.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/58.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/59.jpg', title: ' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/60.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/61.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/62.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/63.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/64.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/65.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/66.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/67.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/68.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/69.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/70.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/71.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/72.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/73.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/74.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/75.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/76.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/77.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/78.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/79.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/80.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/81.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/82.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/83.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/84.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/85.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/86.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/87.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/88.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/89.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/90.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/91.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/92.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/93.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/94.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/95.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/96.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/97.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/98.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/99.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/100.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/101.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/102.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/103.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/104.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/105.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/106.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/107.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/108.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/109.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/110.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/111.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/112.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/113.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/114.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/115.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/116.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/117.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/118.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/119.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/120.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/121.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/122.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/123.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/124.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/125.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/126.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/127.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/128.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/129.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/130.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/131.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/132.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/133.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/134.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/135.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/136.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/137.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/138.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/139.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/140.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/141.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/142.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/143.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/144.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/145.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/146.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/147.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/148.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/149.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/150.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/151.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/152.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/153.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/154.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/155.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/156.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/157.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/158.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/159.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/160.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/161.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/162.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/163.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/164.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/165.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/166.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/167.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/168.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/169.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/170.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/171.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/172.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/173.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/174.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/175.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/176.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/177.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/178.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/179.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/180.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/181.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/182.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/183.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/184.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/185.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/186.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/187.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/188.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/189.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/190.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/191.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/192.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/193.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/194.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/195.jpg', title: 'Панно на кухню из закалённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/196.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/197.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/198.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/199.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/200.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/201.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/202.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/203.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/204.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/205.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/206.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/207.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/208.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/209.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/210.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/211.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/212.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/213.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/214.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/215.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/216.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/217.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/218.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/219.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/220.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/221.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/222.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/223.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/224.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/225.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/226.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/227.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/228.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/229.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/230.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/231.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/232.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/233.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/234.jpg', title: 'Фотопечать на фасадах' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/235.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/236.jpg', title: 'Панель кухонная из калёного стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/237.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/238.jpg', title: 'Фотопечать на фасадах' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/239.jpg', title: 'Фотопечать на фасадах' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/240.jpg', title: 'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/241.jpg', title: 'Фотопечать на фасадах' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/242.jpg', title: 'Фотопечать на фасадах' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/243.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/244.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/245.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/246.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/247.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/248.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/249.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/250.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/251.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/252.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/253.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/254.jpg', title: 'Модульные картины в интерьер из заклённого стекла' },
        { width_n: 295, height_n: 442, url_n: '/content/projects/min/255.jpg', title: 'Фотопечать на фасадах' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/256.jpg', title: 'Кухонные фартуки из заклённого стекла с фотопечатью' },
        { width_n: 442, height_n: 295, url_n: '/content/projects/min/257.jpg', title: 'Фотопечать на фасадах' },
        /*
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/258.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/259.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/260.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/261.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/262.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/263.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/264.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/265.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/266.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/267.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/268.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/269.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/270.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
        {width_n: 442, height_n: 295, url_n: '/content/projects/min/271.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' }          
        */
    ];
    window.tremula.appendData(rs, fartukDataAdapter);//flicker
    window.tremula.cache.endOfScrollFlag = false;
}


// DATA ADAPTER EXAMPLE
//=====================
// flickrDataAdapter() is for use with the flickr API
// https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c149b994c54c114bd7836b61539eec2e&tags=sky%2C+night%2C+day&format=json&page=1

/* SIZE SUFFIX FOR FLICKR IMAGE URLS ===> must be set in above method also
s	small square 75x75
q	large square 150x150
t	thumbnail, 100 on longest side
m	small, 240 on longest side
n	small, 320 on longest side
-	medium, 500 on longest side
z	medium 640, 640 on longest side
c	medium 800, 800 on longest side†
b	large, 1024 on longest side*
o	original image, either a jpg, gif or png, depending on source format
*/

function fartukDataAdapter(data, env) {
    this.data = data;
    this.w = this.width = data.width_n;
    this.h = this.height = data.height_n;
    this.imgUrl = data.url_n;
    this.auxClassList = "flickrRS";//stamp each mapped item with map ID 
    //data-lightbox="image-1" data-title="My caption"
    this.template = this.data.template || ('<img draggable="false" class="moneyShot" onload="imageLoaded(this)" src=""/>');
}

// updateConfig() enables updating of configuration parameters after an instance is running.
// adding an optional true parameter will force a tremula grid redraw with the new parameter in effect
// ----------------------------
// EXAMPLE: tremula.Grid.updateConfig({itemConstraint:100},true);
// ----------------------------

// Use toggleScrollAxis() to set the scrollAxis, 
// see: surfaceMap projection compatibility list above to ensure the projection is compatible with the scrollAxis value
// ----------------------------
// EXAMPLE: tremula.Grid.toggleScrollAxis('y'); 
// ----------------------------

function applyBoxClick() {
    $('.tremulaContainer').on('tremulaItemSelect', function (gestureEvt, domEvt) {
        // console.log(gestureEvt,domEvt)
        var
            $e = $(domEvt.target);
            t = $e.closest('.gridBox')[0];
        if (t) {
            var data = $.data(t).model.model.data;
        }
        if (data){
       		console.log(t);
            	$(t).magnificPopup({
    			type: 'image',
	    	   	closeOnContentClick: true,
		        	mainClass: 'mfp-img-mobile',
		        	image: {
		        		src: t.children[0].src,
			        	verticalFit: true
		        	}
	        	});                        
        } //alert(JSON.stringify(data));
    })
}



$(document).ready(function () {
    
    setTimeout(function () {
        window.tremula = createTremula();
        applyBoxClick();
        loadFlickr();
    }, 500);
});
