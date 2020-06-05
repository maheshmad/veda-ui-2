<template>
<div class="view-content-container">
  <div class="view-nav-container">
      <div class="upload-container">
        <FileUpload @file-uploaded="refreshFileTreeNodes" />
      </div>
      <div class="tree-container">      
        <!-- <SlVueTree ref="filetree" v-model="nodes" @select="onNodeSelect"/>       -->
         <v-jstree :data="nodes" collapse whole-row @item-click="onNodeSelect"></v-jstree>
      </div>
  </div>
  <div class="view-main-content-cont">      
      <b-tabs content-class="mt-3">
        <b-tab title="Original" active>
          <img-view :imgUrl="activePageLink" :background="background" ref="imgcanvas" class="img-style"></img-view>  
        </b-tab>
        <b-tab title="Positional Values">          
          <div ref="imgcanvas" class="img-canvas" ></div>         
        </b-tab>
        <b-tab title="Extracted">          
          <div ref="extrt_table_canvas" class="img-canvas" >
              <b-container fluid  tbody-class="my-class">
                  <b-table caption-top hover light fixed sticky-header responsive :items="tableItems"></b-table>  
              </b-container>
          </div>         
        </b-tab>           
        <b-tab title="Segments">          
          <div ref="imgcanvas2" class="img-canvas" ></div>         
        </b-tab>  
        <b-tab title="Json">          
          <div ref="imgcanvas3" class="img-canvas" ></div>         
        </b-tab>         
      </b-tabs>    
  </div>
  
</div>

</template>

<script>

  // import SlVueTree from '@/components/Tree/sl-vue-tree.vue'
  // import VueTree from '@/components/Tree/sl-vue-tree.vue'
  import VJstree from '@/components/Tree/vjs-tree/tree.vue'
  import FileUpload from '@/components/Form/FileUpload.vue'
  import axios from 'axios'
  import imgView from '@/components/ImgView/vue-img-view.vue'
  import Config from '@/Config.js'


  export default 
  {
    name: 'TextextView',
    components:{
      // SlVueTree,
      FileUpload,
      VJstree,
      imgView
    },
    data ()
    {
      return {
        nodes: null,
        loading: true,
        activePageLink:'',
        background:"black",
        tableItems: null,        
      }
    },
    created ()
    {
       this.loadFileTreeNodes()
    },
    methods:
    {
        refreshFileTreeNodes()
        {
            setTimeout(this.loadFileTreeNodes, 10000);
        },
        
        loadFileTreeNodes()
        {
            this.nodes = [];
            
            axios.get(Config.TEXTEXT_FILES_LIST_API).then(response => 
            {              
              this.loading = false;              
              this.nodes = response.data
              this.loadPageData(null, this.nodes[0].id, this.nodes[0].children[0].id)
              // this.activePageLink = "http://localhost:5007/textext/view/"+this.nodes[0].id+"/page/"+this.nodes[0].children[0].id;

            }).catch(err => 
            {
               console.log(err)
            })
            
        },

        
        loadPageData(node, fid, pgid)
        {
          if (node != null)
          {
            // fid = node[0].parentNode.id
            // pgid = node[0].id

            fid = node.$parent.model.id;
            pgid = node.model.id;            

          }
          
          if (!(fid && pgid))
            return;

          var canvas = this.$refs.imgcanvas; 
          if (!canvas)
            return;
          canvas.innerHTML = '';

          var extractedTableCanvas = this.$refs.extrt_table_canvas;

          this.activePageLink = Config.TEXTEXT_VIEW_ORIG_IMG_API.replace("{fid}", fid).replace("{pgid}",pgid);
          var boundingBoxesLink = Config.TEXTEXT_VIEW_EXRT_FILE_API.replace("{fid}", fid).replace("{pgid}",pgid);
          var extractedDataLink = Config.TEXTEXT_VIEW_EXRT_FILE_API.replace("{fid}", fid).replace("{pgid}",pgid);

          axios.get(extractedDataLink).then(response => 
          {              
              this.loading = false;
              this.tableItems = [];
              var rects = response.data
              if (typeof rects == "string")
                rects = JSON.parse(rects)
              
              var canvas = this.$refs.imgcanvas;              
              // var context = canvas.getContext('2d');  
              // context.lineWidth = 1;
              // context.strokeStyle = "red";                      
              // context.beginPath();
              // context.rect(0, 0, 150, 150);                
              // context.stroke();
              
              for (var i=0;i<rects.length;i++)
              {                
                try
                {
                  var rect = rects[i];
                  var rectnode = document.createElement("div");
                  
                  var scale = 35;
                  var left = Math.round((rect.x1) * ((100 -scale)/100));
                  var top = Math.round((rect.y1) * ((100 -scale)/100));
                  var width = Math.round((rect.x2 - rect.x1) * ((100 -scale)/100));
                  var height = Math.round((rect.y2 - rect.y1) * ((100 -scale)/100));
                  // var boxstyle = "top:"+top+";left:"+left+";width:"+width+";height:"+height+
                  //                   ";font-size:xx-small;position:absolute;border-style:solid;border-width: thin;color:green;border-color:red;"
                  var boxstyle = "top:"+top+";left:"+left+";width:"+width+";height:"+height+
                                    ";font-size:12px;position:absolute;color:green"
                  rectnode.setAttribute("style", boxstyle);
                  rectnode.innerHTML = "<p>"+rect.pred+"</p>";
                  canvas.appendChild(rectnode);

                  /*
                  * add the key value pairs to tableItems 
                  */
                 this.tableItems.push({id:i, val:rect.pred});

                  
                }
                catch(e)
                {
                  console.log(e)
                }
              }

          }).catch(err => 
          {
              canvas.innerHTML = "<h4 style='color:red'>"+err+"</h4>";
          })
          
          var segmentcanvas = this.$refs.imgcanvas2;   
          segmentcanvas.innerHTML = '';
          axios.get(boundingBoxesLink).then(response => 
          {              
              this.loading = false;
              var rects = response.data
              if (typeof rects == "string")
                rects = JSON.parse(rects)
                                       
              // var context = canvas.getContext('2d');  
              // context.lineWidth = 1;
              // context.strokeStyle = "red";                      
              // context.beginPath();
              // context.rect(0, 0, 150, 150);                
              // context.stroke();
              
              for (var i=0;i<rects.length;i++)
              {                
                try
                {
                  var rect = rects[i];
                  var rectnode = document.createElement("div");
                  rectnode.setAttribute("class", "rect-item");
                  if (rect.isleaf)
                  {
                    var scale = 55;
                    var left = Math.round((rect.x1) * ((100 -scale)/100));
                    var top = Math.round((rect.y1) * ((100 -scale)/100));
                    var width = Math.round((rect.x2 - rect.x1) * ((100 -scale)/100));
                    var height = Math.round((rect.y2 - rect.y1) * ((100 -scale)/100));
                    var boxstyle = "top:"+top+";left:"+left+";width:"+width+";height:"+height+
                                      ";font-size:xx-small;position:absolute;border-style:solid;border-width: thin;color:green;border-color:green;"                    
                    rectnode.setAttribute("style", boxstyle);
                    rectnode.innerHTML = "<p>"+rect.pred+"</p>";
                    segmentcanvas.appendChild(rectnode);
                  }
                }
                catch(e)
                {
                  console.log(e)
                }
              }

            }).catch(err => 
            {
               segmentcanvas.innerHTML = "<h4 style='color:red'>"+err+"</h4>";
            })
        },

        onNodeSelect(node) 
        {
          console.log("----------------inside node click----------")
          // this.$refs.centerimg.setSrc(""<h1>"+"clicked on "+node[0].id+" , parent id = "+node[0].parentNode.id+"</h1>"";
          // return;
          
          
          this.loadPageData(node);          

        }
    }  
  }
</script>

<style scoped>

.view-content-container
{
  display:flex;
  justify-content: stretch;  
  background-color: black;
  width: 100%;
  height: 100%;
}

.view-nav-container
{
  flex:1;
  background-color: black;
  height: 100%;
}

.view-main-content-cont
{
  flex:5;
  background-color: black;
  height: 100%;
}

.img-style {  
  height: 100%;
  width: 100%;
  position:relative;
  float:left;
  top:0;
  left:0;
  overflow: scroll;
  background-color: black;
}

.img-canvas {  
  position: relative;
  float: left;
  top: 0;
  left:0;
  overflow: scroll;
  width:100%; 
  height:100%;
  border: 2px;
  border-style: solid;
  border-color:gray;
}

.rect-item{
  position: absolute;
  width: 150;
  height: 150;
  top: 0;
  left:0;
  border: 2px;
  border-style: solid;
  border-color: red;
}

.tree-container{
  overflow-y: auto;
  height:500px;
  flex:15;
}

.upload-container{
  flex:3;
}

.table.my-table > tbody {
    height: 100px;
}
</style>
