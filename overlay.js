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
            

            var camera, scene, renderer;
            var geometry, material, mesh;

            this.camera = null;
            this.scene = null;
            this.renderer = null;
            this.mesh = null;
            this.cylinder = null;
            this.temp = null;

            var self = this;

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
        {5
             var mapSize = this.getMapSize();
             this.renderer.setSize(mapSize.width,mapSize.height);
             this.camera.aspect = mapSize.width/mapSize.height;
        }

        MyOverlay.prototype.createRenderer = function()
        {
                var size = this.getMapSize();
                var geometry, material;
                this.camera = new THREE.PerspectiveCamera(90, size.width / size.height, 0.1, 10000);
                this.camera.position.set(0,0,0);
            
                this.scene = new THREE.Scene();
            
                var cube = .5;
                geometry = new THREE.BoxGeometry(cube,cube,cube);
                material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xc0dd0c),
                    metalness: 1,
                    roughness: 0.5
                });

              

                //34.81381594348493, -87.67265878988076
                this.mesh = new THREE.Mesh(geometry, material);
                this.scene.add(this.mesh);
                this.mesh.setLatLng(new WorldCoord(thePos.lat,thePos.lng,1));



                var cylinderg = new THREE.CylinderGeometry( 0.1, 0.1, 4, 10 );
                var mat = new THREE.MeshBasicMaterial( {color: 0x7cd85b, transparent: true, opacity: 0.5} );
                this.cylinder = new THREE.Mesh( cylinderg, mat );
                this.cylinder.setLatLng(new WorldCoord(thePos.lat,thePos.lng,-1));
                this.scene.add( this.cylinder );


                // White directional light at half intensity shining from the top.
                var directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
                directionalLight.position.set( 0, 1, 0 );
                this.scene.add( directionalLight );

                var light = new THREE.PointLight( 0xffffff,1,100 ); // soft white light
                light.position.set(0,0,0);
                this.scene.add( light );




                var myHouse  = new THREE.BufferGeometry();
               
                var vertices = [];
                var loc = panorama.getPosition();
                var source = {lat: 34.813818, lng: -87.672830};
                vertices[0] = latLngToRelativeCartesian(source,pts[0]);
                vertices[1] = latLngToRelativeCartesian(source,pts[1]);
                vertices[2] = latLngToRelativeCartesian(source,pts[2]);
                vertices[3] = latLngToRelativeCartesian(source,pts[3]);
                //vertices[4] = vertices[3].clone();

               

                var yy = 3;
                var verts = new Float32Array(18);
                for (var i = 0; i < 3; i++)
                {
                      verts[i*3 + 0] = vertices[i].x;
                      verts[i*3 + 1] = -yy;
                      verts[i*3 + 2] = vertices[i].z;
                      console.log(vertices[i]);
                }

               

                      verts[3*3 + 0] = vertices[2].x;
                      verts[3*3 + 1] = -yy;
                      verts[3*3 + 2] = vertices[2].z;

                      verts[4*3 + 0] = vertices[3].x;
                      verts[4*3 + 1] = -yy;
                      verts[4*3 + 2] = vertices[3].z;

                      verts[5*3 + 0] = vertices[0].x;
                      verts[5*3 + 1] = -yy;
                      verts[5*3 + 2] = vertices[0].z;


                   
                      

               myHouse.addAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );
               myHouse.computeFaceNormals();
               myHouse.computeVertexNormals();

                //myHouse.computeBoundingSphere();




                var uniforms = {  
                color: { type: "c", value: new THREE.Color( 0xe23b0d ) },
                };

  // My float attribute
                var attributes = {  
                  size: { type: 'f', value: [] },
                };
                

                for (var i=0; i < 5; i++) {  
                  attributes.size.value[i] = 5 + Math.floor(Math.random() * 10);
                }
                omaterial = new THREE.ShaderMaterial({  
                uniforms: uniforms,
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent,
                transparent: true
                });



              



               this.temp = new THREE.Mesh( myHouse, material);
                this.scene.add( this.temp );
                this.temp.setLatLng(new WorldCoord(34.813818, -87.672830,0));
                

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

        THREE.Object3D.prototype.setLatLng = function(worldCoord)
        {
                var loc = panorama.getPosition();
                var source = {lat: loc.lat(), lng: loc.lng()};
                var d = latLngToRelativeCartesian(source,worldCoord);
                console.log(d);
                console.log(worldCoord);
                this.position.set(d.x,worldCoord.z,d.z);
                this.worldCoord = worldCoord; 
        }

        THREE.Object3D.prototype.updatePosition = function()
        {
            this.setLatLng(this.worldCoord);
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

function WorldCoord(lat,lng,z=0)
{
    this.lat = lat;
    this.lng = lng;
    this.z = z;
}



    