function createTremula(){

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
      itemConstraint      :250,//px

      //Margin in px added to each side of each content item
      itemMargins         :[20,10],//x (left & right), y (top & bottom) in px

      //Display offset of static axis (static axis is the non-scrolling dimention)
      staticAxisOffset    :0,//px

      //Display offset of scroll axis (this is the amount of scrollable area added before the first content block)
      scrollAxisOffset    :20,//px

      //Sets the scroll axis 'x'|'y'.
      //NOTE: projections generally only work with one scroll axis
      //when changeing this value, make sure to use a compatible projection
      scrollAxis          :'x',//'x'|'y'

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
      surfaceMap          :tremula.projections.mountain,//userProjection,

      //how many rows (or colums) to display.  note: this is zero based -- so a value of 0 means there will be one row/column
      staticAxisCount     :1,//zero based 

      //the grid that will be used to project content
      //NOTE: Generally, this will stay the same and various surface map projections
      //will be used to create various 3d positioning effects
      defaultLayout       :tremula.layouts.xyPlain,

      //it does not look like this actually got implemented so, don't worry about it ;)
      itemPreloading      :true,

      //enables the item-level momentum envelope
      itemEasing          :false,

      //enables looping with the current seet of results
      isLooping         	:false,

      //if item-level easing is enabled, it will use the following parameters
      //NOTE: this is experimental. This effect can make people queasy.
      itemEasingParams    :{
        touchCurve          :tremula.easings.easeOutCubic,
        swipeCurve          :tremula.easings.easeOutCubic,
        transitionCurve     :tremula.easings.easeOutElastic,
        easeTime            :500,
        springLimit         :40 //in px
      },

      //method called after each frame is painted. Passes internal parameter object.
      //see fn definition below
      onChangePub					: doScrollEvents,

      //content/stream data can optionally be passed in on init()
      data                : null,

      // lastContentBlock enables a persistant content block to exist at the end of the stream at all times.
      // Common use case is to target $('.lastContentItem') with a conditional loading spinner when API is churning.
      lastContentBlock 		: {
        template :'<div class="lastContentItem"></div>',
        layoutType :'tremulaBlockItem',
        noScaling:true,
        w:300,
        h:300,
        isLastContentBlock:true,
        adapter:tremula.dataAdapters.TremulaItem
      },

      //dafault data adapter method which is called on each data item -- this is used if none is supplied during an import operation
      //enables easy adaptation of arbitrary API data formats -- see flickr example
      adapter             :null

    };

    //initalize the tremula instance with 3 parameters: 
    //a DOM container, a config object, and a parent context
    tremula.init($tremulaContainer,config,this);

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
  function doScrollEvents(o){
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
  function loadFlickr(){
      var rs = [
{width_n: 800, height_n: 600, url_n: '/content/projects/1.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/2.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/3.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 2600 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/4.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/5.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/6.jpg', title:'Кухонное стеклянное панно из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/7.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/8.jpg', title:'Кухонное стеклянное панно из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/9.jpg', title:'Кухонное стеклянное панно из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/10.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/11.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/12.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/13.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/14.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/15.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/16.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/17.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/18.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/19.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/20.jpg', title:'Фартук для кухни из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/21.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/22.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/23.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/24.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/25.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/26.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/27.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/28.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/29.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/30.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/31.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/32.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/33.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/34.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/35.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/36.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/37.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/38.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/39.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/40.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/41.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/42.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/43.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/44.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/45.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/46.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/47.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/48.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/49.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/50.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/51.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/52.jpg', title:'Стеклянный кухонный фартук' },
{width_n: 800, height_n: 600, url_n: '/content/projects/53.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/54.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/55.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/56.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/57.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/58.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/59.jpg', title:' Кухонный фартук из закалённого стекла с фотопечатью.Длина одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/60.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/61.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/62.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/63.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/64.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/65.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/66.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/67.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/68.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/69.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/70.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/71.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/72.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/73.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/74.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/75.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/76.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/77.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/78.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/79.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/80.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/81.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/82.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/83.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/84.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/85.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/86.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/87.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/88.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/89.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/90.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/91.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/92.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/93.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/94.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/95.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/96.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/97.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/98.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/99.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/100.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/101.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/102.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/103.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/104.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/105.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/106.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/107.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/108.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/109.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/110.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/111.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/112.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/113.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/114.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/115.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/116.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/117.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/118.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/119.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/120.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/121.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/122.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/123.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/124.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/125.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/126.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/127.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/128.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/129.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/130.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/131.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/132.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/133.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/134.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/135.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/136.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/137.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/138.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/139.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/140.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/141.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/142.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/143.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/144.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/145.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/146.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/147.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/148.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/149.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/150.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/151.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/152.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/153.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/154.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/155.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/156.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/157.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/158.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/159.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/160.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/161.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/162.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/163.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/164.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/165.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/166.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/167.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/168.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/169.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/170.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/171.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/172.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/173.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/174.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/175.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/176.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/177.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/178.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/179.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/180.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/181.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/182.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/183.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/184.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/185.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/186.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/187.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/188.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/189.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/190.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/191.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/192.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/193.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/194.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/195.jpg', title:'Панно на кухню из закалённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/196.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/197.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/198.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/199.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/200.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/201.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/202.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/203.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/204.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/205.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/206.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/207.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/208.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/209.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/210.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/211.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/212.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/213.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/214.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/215.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/216.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/217.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/218.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/219.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/220.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/221.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/222.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/223.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/224.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/225.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/226.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/227.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/228.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/229.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/230.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/231.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/232.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/233.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/234.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/235.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/236.jpg', title:'Панель кухонная из калёного стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/237.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/238.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/239.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/240.jpg', title:'Кухонное стеклянное панно из закалённого стекла. Длинна одного стекла более 3000 мм.' },
{width_n: 800, height_n: 600, url_n: '/content/projects/241.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/242.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/243.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/244.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/245.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/246.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/247.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/248.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/249.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/250.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/251.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/252.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/253.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/254.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/255.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/256.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/257.jpg', title:'Фотопечать на фасадах' },
{width_n: 800, height_n: 600, url_n: '/content/projects/258.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/259.jpg', title:'Модульные картины в интерьер из заклённого стекла' },
{width_n: 800, height_n: 600, url_n: '/content/projects/260.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/261.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/262.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/263.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/264.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/265.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/266.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/267.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/268.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/269.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/270.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' },
{width_n: 800, height_n: 600, url_n: '/content/projects/271.jpg', title:'Кухонные фартуки из заклённого стекла с фотопечатью' }          
];
      tremula.appendData(rs,fartukDataAdapter);//flicker
      tremula.cache.endOfScrollFlag = false;
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

  function fartukDataAdapter(data,env){
    this.data = data;
    this.w = this.width = data.width_n;
    this.h = this.height = data.height_n;
    this.imgUrl = data.url_n;
    this.auxClassList = "flickrRS";//stamp each mapped item with map ID 
    this.template = this.data.template||('<img draggable="false" class="moneyShot" onload="imageLoaded(this)" src=""/>');
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

  function applyBoxClick(){
    $('.tremulaContainer').on('tremulaItemSelect',function(gestureEvt,domEvt){
      // console.log(gestureEvt,domEvt)
      var 
        $e = $(domEvt.target);
        t = $e.closest('.gridBox')[0];
      if(t){
        var data = $.data(t).model.model.data;
      }
      if(data)alert(JSON.stringify(data));
    })
  }



//====================
// This is a custom Projection template which allows you to specify your own bezier path
// To use, modify the above configuration @ surfaceMap -->  surfaceMap : userProjection,

//EXPERIMENTAL! Generally, this works, But it's not particularly tested. Some paths may not work as expected.
//Please file bugs to https://github.com/garris/TremulaJS/issues

// ALSO:  This currently only works in horizontal mode.  Vertical coming soon.

// Handy bezier editor/visualizer here --> https://www.desmos.com/calculator/iaf7aha9yl

	var userPath = [
		{x:0,y:.2},
		{x:.5,y:.5},
		{x:.5,y:.8},
		{x:1,y:.5}
	];



	function userProjection(x,y){

		var curve = userPath;

		var 
		grid0 = this.parent.gridDims[0],
		grid1 = this.parent.gridDims[1],
		axisLength = this.parent.currentGridContentDims,
		tRamp = this.waves.tailRamp,
		hRamp = this.waves.headRamp,
		tri = this.waves.triangle,
		xo,
		yo;

		var xyFactor = [
			grid0,
			grid1
		];

		var cubicBezier = jsBezier.factorCurveBy(curve,xyFactor);
		
		var p = jsBezier.pointOnCurve(cubicBezier, tRamp);
		var g = jsBezier.gradientAtPoint(cubicBezier, tRamp);

		var xo = p.x - (this.dims[0]*.5);

		var yo = grid1 - p.y - (this.dims[1]*.5) - (((axisLength[1]-this.dims[1])*.5) - y - this.itemMargins[1]);

		var zo = 0;

		this.e.style.transformOrigin = this.e.style.webkitTransformOrigin = this.e.style.MozTransformOrigin = '50%';
		
		this.e.style.transform = this.e.style.MozTransform = this.e.style.webkitTransform = 'translate3d(' + xo + 'px,' + yo +'px, ' + zo + 'px)' + ' rotateZ('+g*40+120+'deg)';

		var z = 10000-this.index;
		this.e.style.zIndex = z;

		this.e.style.opacity = 1;
     //this.e.style.zIndex = Math.abs(Math.floor(tri*100));
    
    
		this.pPos = [x,y];
	}     
	
	
	$(document).ready(function(){
     setTimeout(function(){
       window.tremula = createTremula();
       applyBoxClick();
       loadFlickr()
      },0);
     });
	
