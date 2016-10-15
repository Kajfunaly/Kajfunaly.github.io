function getWH(){
        return{
            w:parseInt(window.document.documentElement.clientWidth)<parseInt(screen.width)?parseInt(window.document.documentElement.clientWidth):parseInt(screen.width),
            h:parseInt(window.document.documentElement.clientHeight)<parseInt(screen.height)?parseInt(window.document.documentElement.clientHeight):parseInt(screen.height)
        }
    };
    (function() {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.oRequestAnimationFrame||
            window.msRequestAnimationFrame||
            function(a){
                window.setTimeout(a,1E3/60);
            };
        window.requestAnimationFrame = requestAnimationFrame;
    })();
    function step(draw, duration) {
        try{
            var start2 = performance.now();
            requestAnimationFrame(function step(time) {
                var timePassed = time - start2;
                if (timePassed >= duration)
                    return draw();
                if (timePassed < duration) {
                    requestAnimationFrame(step);
                }
            });
        }
        catch (e){
            setTimeout(draw,duration);
        }
    };
    function startLev(lev){
        lev1=new Level({
            lev:lev
        });
        lev1.draw();
    }
    function timeMS(t){
        var m=Math.floor(t/60);
        var s=t%60;
        return m+':'+(s<10?(''+0+s):s);
    }
    function Level(ob){
        var o=this;
        var q=2;
        this.lev=ob.lev||1;
        if (window.localStorage){
            localStorage.lev=o.lev;
        }
        this.start;
        this.pause=0;
        this.cntM=count[this.lev-1];
        this.cnt=this.cntM[0];
        this.cntMin=count1[this.cntM[1]][0];
        this.cntMax=count1[this.cntM[1]][1];
        this.img=[];
        this.imgId=[];
        this.flip=[];
        this.wMax=ob.wMax||200;
        this.map=map[this.lev-1];
        this.diff=diff[this.lev-1];
        this.cntY=this.map.length;
        this.cntX=[];
        this.cntXmax=0;
        this.randLev=Math.floor(Math.random()*cntLev)+1;
        for (var n=0;n<this.cntY;n++){
            this.cntX.push(this.map[n].length);
            if (this.cntX[n]>this.cntXmax)
                this.cntXmax=this.cntX[n];
        };
        this.left=[];
        this.wh=function(){
            var w=getWH().w/this.cntXmax-7;
            var h=(getWH().h-25)/this.cntY-7;
            if (w<this.wMax||h<this.wMax){
                if (w>h) this.w=h;
                else this.w=w;
            }
            else this.w=this.wMax;
        };
        this.wh();
        this.cnt1=0;
        this.a=0;
        this.pp;
        this.hod=0;
        this.kk=[];
        this.mix=function(cnt,cntMin,cntMax){
            var mInt=[];
            var compR=function(a, b) {
                return Math.random() - 0.5;
            }
            for (var i=cntMin;i<cntMax;i++){
                mInt.push(i);
            }
            mInt.sort(compR);
            mInt.length=cnt;
            mInt=mInt.concat(mInt);
            mInt.sort(compR);
            return mInt;
        };
        this.mInt=this.mix(this.cnt, this.cntMin,this.cntMax);
        this.result=['Идеально!','Отлично!','Хорошо.','Можно лучше...'];
        this.win=function(){
            var result;
        var hod=this.hod/2;
            if (hod==this.cnt) result=this.result[0];
        else if ((hod/this.cnt)<=1.7) result=this.result[1];
        else if ((hod/this.cnt)<=3) result=this.result[2];
        else result=this.result[3];
            var allTime=timeMS(Math.round((Date.now()-this.start)/1000));
            text.innerHTML=result+'<br>Всего пар:&nbsp;'+this.cnt+'<br>Ходов:&nbsp;'+hod+'<br>Время:&nbsp;'+allTime;
            nextL.style.display='block';
            this.div.style.display='none';
        };
        this.rotAn=function(img,kk,n,t){
            step(function(){
                img.classList.add('rot');
                step(function(){img.style.backgroundPosition=((-kk)*o.w-q)+'px '+(0-q)+'px';},1);
                o.flip[n]=0;
                if (o.hod==0&&n==o.cnt) {
                    o.a=1;
                    o.timer.style.opacity='0';
                    o.head.style.opacity='1';
                }
                if (o.hod){
                    o.a=1;
                    o.pp='';
                }
                step(function(){
                    img.classList.remove('rot');
                    if (n==o.cnt) o.timer.style.display='none';
                },1000);
            },t);
        };
        this.scaleAn=function(img,t){
            img.classList.add('scale');
            step(function(){
                img.style.webkitAnimationPlayState='running';
                img.style.mozAnimationPlayState='running';
                img.style.oAnimationPlayState='running';
                img.style.animationPlayState='running';
                step(function(){
                    img.classList.remove('scale');
                },2001);
            },t);
        };
        this.leftD=function(){
            return (getWH().w-this.cntXmax*(this.w+5))/2;
        };
        this.topD=function(){
            return(getWH().h-this.cntY*(this.w+5))/2+15;
        };
        this.wD=function(){
            return this.cntXmax*(this.w+5);
        };
        this.hD=function(){
            return this.cntY*(this.w+5);
        };
        this.divSize=function(){
            this.div.style.left=this.leftD()+'px';
            this.div.style.top=this.topD()+'px';
            this.div.style.width=this.wD()+'px';
            this.div.style.height=this.hD()+'px';
        };

        this.leftLine=function(line){
            return ((this.cntXmax-this.cntX[line])*(this.w+5))/2
        }
        this.leftP=function(i,j){
            return this.left[i]+j*(this.w+5)+q+'px';
        }
        this.topP=function(i,k){
            return (i+(k%1?0.5:0))*(this.w+5)+q+'px';
        }
        this.whP=function(){
            return (this.w-q*2)+'px';
        }
        this.imgSize=function(img,i,j,k){
            img.style.left=this.leftP(i,j);
            img.style.top=this.topP(i,k);
            img.style.width=img.style.height=this.whP();
            img.style.backgroundSize='auto '+this.w*5+'px';
        }
        this.imgBack=function(r){
            return ((-r%10)*this.w-q)+'px '+((Math.floor(r/10)+1)*this.w*(-1)-q)+'px';
        }
        this.draw=function(){
            var div = document.createElement("div");
            div.className='dd';
            var photo2=photo1[photo[this.lev-1]];
            if (photo2){
                div.style.background=photo2[0];
                div.style.backgroundSize=photo2[1];
            }
            this.div=div;
            this.divSize();
            div.ontouchstart=function(){return false};
            var n=0;
            for (var i=0;i<this.cntY;i++){
                this.left[i]=this.leftLine(i);
                for (var j=0;j<this.cntX[i];j++){
                    var k=this.map[i][j];
                    if (k!=0){
                        var img = document.createElement("div");
                        var r=this.mInt[n];
                        img.className='pare';
                        img.classList.add(bg1[bg[this.lev-1]]);
                        img.classList.add(ang[this.lev-1]);

                        this.imgSize(img,i,j,k);
                        img.style.backgroundPosition=this.imgBack(r);
                        this.img.push(img);
                        this.imgId.push([i,k,j]);
                        this.flip.push(1);
                        var kk=Math.round(k)-1;
                        this.kk.push(kk);
                        img.onclick=img.ontouchstart=function(e){
                            e.preventDefault();
                            if (o.a) o.rot(this);
                        };
                        this.scaleAn(img,n*70);
                        this.rotAn(img,kk,n,7000+n*50+this.cnt*2*70);
                        div.appendChild(img);
                        n++;
                    }
                }
            }
            document.body.appendChild(div);
            var timer1= document.createElement("div");
            timer1.className='timer-container';
            var timer= document.createElement("div");
            timer.className='timer';
            timer.style.webkitAnimationDelay=2+this.cnt*2*0.07+'s';
            timer.style.mozAnimationDelay=2+this.cnt*2*0.07+'s';
            timer.style.oAnimationDelay=2+this.cnt*2*0.07+'s';
            timer.style.animationDelay=2+this.cnt*2*0.07+'s';
            for(var n=5;n>=0;n--){
                var sp=document.createElement("div");
                sp.innerHTML=n;
                timer.appendChild(sp);
            }
            timer1.appendChild(timer);
            document.body.appendChild(timer1);
            this.timer=timer1;
            var head=document.createElement("div");
            head.className='head';
            var par=document.createElement("span");
            par.innerHTML ='Всего пар:&nbsp;'+this.cnt;
            head.appendChild(par);
            var hod=document.createElement("span");
            hod.innerHTML ='Ходов:&nbsp0';
            head.appendChild(hod);
            document.body.appendChild(head);
            this.head=head;
            this.hodText=hod;
        };
        this.rot=function (i) {
            if (this.start===undefined)
                this.start=Date.now();
            if (this.pp&&i==this.pp[1]) return;
            if (this.pause) {
                this.start+=Date.now()-this.pause;
                this.pause=0;
            }
            this.hod++;
            var ind=this.img.indexOf(i);
            var r=this.mInt[ind];
            var k=this.kk[ind];
            i.style.backgroundPosition=this.imgBack(r);
            o.flip[ind]=1;
            if (this.hod%2) this.pp=[r,i,k,ind];
            else {
                this.hodText.innerHTML ='Ходов:&nbsp'+this.hod/2;
                this.a=0;
                if (o.pp[0]==r){
                    setTimeout(function(){
                        i.style.webkitTransform='scale(0)';
                        i.style.mozTransform='scale(0)';
                        i.style.oTransform='scale(0)';
                        i.style.transform='scale(0)';
                        o.pp[1].style.webkitTransform='scale(0)';
                        o.pp[1].style.mozTransform='scale(0)';
                        o.pp[1].style.oTransform='scale(0)';
                        o.pp[1].style.transform='scale(0)';
                        i.style.opacity=0;
                        o.pp[1].style.opacity=0;
                        o.cnt1++;
                        if (o.cnt==o.cnt1) {
                            o.win();
                        }
                        o.a=1;
                        o.pp='';
                    },800);
                }
                else {
                    o.rotAn(i,k,ind,800);
                    o.rotAn(o.pp[1],o.pp[2],o.pp[3],800);
                }
            }
        };
        this.resize=function(){
            this.wh();
            this.divSize();
            for (var n=0;n<this.cnt*2;n++){
                var img=this.img[n];
                var i=this.imgId[n][0];
                var k=this.imgId[n][1];
                var j=this.imgId[n][2];
                var r=this.mInt[n];
                this.left[i]=this.leftLine(i);
                this.imgSize(img,i,j,k);
                if (this.flip[n]){
                    img.style.backgroundPosition=this.imgBack(r);
                }
                else
                    img.style.backgroundPosition=((-Math.round(k)+1)*this.w-q)+'px '+(0-q)+'px';
            }
        };
        this.removeLev=function(){
            try{
                this.div.remove();
                this.head.remove();
                this.timer.remove();
            }
            catch(e){
                this.div.parentNode.removeChild(this.div);
                this.head.parentNode.removeChild(this.head);
                this.timer.parentNode.removeChild(this.timer);
            }
       }
    };
