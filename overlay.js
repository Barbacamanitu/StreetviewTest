var MyOverlay = function(){};


function initOverlay()
{
        MyOverlay = function(map,mapDiv){
            this.setMap(map);
            this.context = null;
            this.canvas = null;
            this.zindex = 0;
            this._div = null;
            this.mapDiv = mapDiv;
            var self = this;

            var camera, scene, renderer;
            var geometry, material, mesh;

            this.camera = null;
            this.scene = null;
            this.renderer = null;
            this.mesh = null;



            $(window).resize(function(){self.resizeRenderer();});
        }; 

    

        MyOverlay.prototype = new google.maps.OverlayView();

        MyOverlay.prototype.getMapSize = function()
        {
            return {width: this.mapDiv.offsetWidth, height: this.mapDiv.offsetHeight};
        };

        MyOverlay.prototype.zindex = 15;
        MyOverlay.prototype.draw = function(){
            var pov = panorama.getPov();
            var pitch = THREE.Math.degToRad(pov.pitch);
            var heading = THREE.Math.degToRad(-pov.heading);
            var euler = new THREE.Euler(pitch,heading,0,"YXZ");
            this.camera.setRotationFromEuler(euler);
            //console.log(this.camera.getWorldRotation().y);
            this.camera.fov = (Math.atan(Math.pow(2, -panorama.getZoom())) * 360 / Math.PI);
            this.camera.updateProjectionMatrix();
        };

        MyOverlay.prototype.onAdd = function(){
            console.log("add");
            //this.createCanvas();
            this.createRenderer();
            this.animate();
            

            //this.context = this.canvas.getContext('2d');
        };

        MyOverlay.prototype.resize = function()
        {
            return;
            var mapSize = this.getMapSize();
            this.canvas.width = mapSize.width;
            this.canvas.height = mapSize.height;
            this.canvas.style.width = this.canvas.width;
            this.canvas.style.height = this.canvas.height;
        };

        MyOverlay.prototype.resizeRenderer = function()
        {
             var mapSize = this.getMapSize();
             this.renderer.setSize(mapSize.width,mapSize.height);
             this.camera.aspect = mapSize.width/mapSize.height;
        }

        MyOverlay.prototype.drawCircle = function(x,y, radius = 10)
        { 
          var context = this.context;
          context.beginPath();
          context.arc(x,y, radius, 0, 2 * Math.PI, false);
          context.fillStyle = 'green';
          context.fill();
          context.lineWidth = 5;
          context.strokeStyle = '#003300';
          context.stroke();
      
        };

        MyOverlay.prototype.createCanvas = function()
        {
            var canvas = document.createElement("canvas");  
            canvas.style.position = 'absolute';            
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(canvas);
            this.canvas = canvas;
            this.context = this.canvas.getContext('2d');
            this.resize();
        };

        MyOverlay.prototype.createRenderer = function()
        {
                var size = this.getMapSize();
                var geometry, material;
                this.camera = new THREE.PerspectiveCamera(90, size.width / size.height, 0.1, 10000);
                this.camera.position.set(0,2.5,0);
            
                this.scene = new THREE.Scene();
            
                var cube = .5;
                geometry = new THREE.BoxGeometry(cube,cube,cube);
                material = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    wireframe: true
                });

              

                //34.81381594348493, -87.67265878988076
                this.mesh = new THREE.Mesh(geometry, material);
                this.scene.add(this.mesh);
                this.mesh.setLatLng({lat: 34.803441, lng:-87.674732});



                var cylinderg = new THREE.CylinderGeometry( 0.2, 0.2, 5, 10 );
                var mat = new THREE.MeshBasicMaterial( {color: 0x7cd85b, transparent: true, opacity: 0.5} );
                var cylinder = new THREE.Mesh( cylinderg, mat );
                cylinder.setLatLng({lat: 34.803441, lng:-87.674732},5);
                this.scene.add( cylinder );
                



                this.renderer = new THREE.WebGLRenderer({alpha: true});
                //this.renderer.setSize(size.width, size.height);
                this.resizeRenderer();
                var panes = this.getPanes();
                panes.overlayLayer.appendChild(this.renderer.domElement);  
               

        };



        

        MyOverlay.prototype.animate = function()
        {
                requestAnimationFrame(this.animate.bind(this));
                this.mesh.rotation.x += 0.01;
                this.mesh.rotation.y += 0.02;
                this.renderer.render(this.scene, this.camera);
        };

        MyOverlay.prototype.clear = function()
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };


        //THREE.js additions

        THREE.Object3D.prototype.setLatLng = function(latlng, z = 0)
        {
                var loc = panorama.getPosition();
                var source = {lat: loc.lat(), lng: loc.lng()};
                var d = latLngToRelativeCartesian(source,latlng);
                d.multiplyScalar(1);
                this.position.set(d.x,z,d.z);
        }

       function latLngToRelativeCartesian(src,dest)
        {

            //Positive Z is north. 0 heading.
            //Positive X is east. 90 heading. sin(90) = 1  


            var s = new google.maps.LatLng(src);
            var d = new google.maps.LatLng(dest);
            var heading = google.maps.geometry.spherical.computeHeading(s,d);
           // heading+=180;
            console.log("heading: "+heading);
            var dis = google.maps.geometry.spherical.computeDistanceBetween(s,d);
            var angle = THREE.Math.degToRad(-heading);
            var vec = new THREE.Vector3(-Math.sin(angle),0,-Math.cos(angle));
            vec.multiplyScalar(dis);
            return vec;
        }

     
}



    