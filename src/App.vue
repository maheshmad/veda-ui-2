<template>
  <div id="app" class="main-container">
    <div class="main-header">
          <img alt="Intellect SEEC" class="logo" src="@/assets/images/intellectlogo.png">
        
          <component :is="currentMenu" :right="side === 'right' ? true: false">
              <a href="#/home">
                  <i class="fas fa-home"></i>
                  <span>Home</span>
              </a>
              <a href="#/topics">
                  <i class="fab fa-buromobelexperte"></i>
                  <span>Research Topics</span>
              </a>
              <a href="#/notebooks">
                  <i class="fas fa-book-open"></i>
                  <span>Notebooks</span>
              </a>              
              <a href="#/datasets">
                  <i class="fas fa-database"></i>
                  <span>Datasets</span>
              </a>              
              <a href="#/login">
                  <i class="fas fa-sign-in-alt"></i>
                  <span>Logout</span>
              </a>
          </component>
    </div>
    
    <div class="main-content">
        <router-view />
    </div>
    
    <div class="main-footer">          
    </div>
  </div>


</template>
<script>
    import slide from './components/Menu/slide';    
    import Menu from './components/Menu/Menu';

    export default 
    {
      data() 
      {
        return {
          menus: {
            slide: { buttonText: 'Slide' },           
          },
          side: 'right',
          currentMenu: 'slide'
        };
      },
      components: 
      {
        slide,      
        Menu
      },
      methods: 
      {
        changeMenu(menu) 
        {
          this.currentMenu = menu.replace(/ +/g, '').toLowerCase();
          return this.currentMenu;
        },
        changeSide(side) 
        {
          this.side = side;
        }
      }
    };
</script>

 <style>
    #app{
      display:flex;
      width:100%;
      height: 100%;
    }
    body{
      height:100%;
      width:100%;
    }
    .main-container {
      display: flex;
      flex-wrap: wrap;
      flex-direction:column;
      justify-content: stretch; 
      align-content: stretch;
    }
    .main-header {
      flex:3;
      max-height: 50px;
      justify-content: space-between;
    }
    .main-content {
      flex:15;
      /* align-items: stretch;  */
      overflow: auto;
      display:flex;
    }
    .main-footer {
      flex:1;
      max-height: 15px;
    }


   
</style>