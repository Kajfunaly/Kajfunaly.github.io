function getWH(){
    return{
        w:parseInt(window.document.documentElement.clientWidth)<parseInt(screen.width)?parseInt(window.document.documentElement.clientWidth):parseInt(screen.width),
        h:parseInt(window.document.documentElement.clientHeight)<parseInt(screen.height)?parseInt(window.document.documentElement.clientHeight):parseInt(screen.height)
    }
};
function getWC(){
	var w=getWH().w;
	var h=getWH().h;
	var rat=w/h;
	if (w>=640) wc=20;
    if (w<=640 && h>=640)
        wc=20;
    if ((w<=380 && h<=380)||(w<=320 && h>=320))
        wc=10;
    if ((w<=470 && w>=380 && h<=470)||(w<=380 && h>=380))
        wc=12;
    if ((w<=640 && w>=470 && h<=640)||(w<=470 && h>=470))
        wc=15;
       //alert(w+','+h+','+wc);
    return wc;
};

function newGame(){
	enemyFleet.start=0;
	setTimeout(function(){
fleetsArr.innerHTML='';
	fleetsArr.classList.remove('startGame');
    fleet1=enemyFleet=new Fleet(ts,fleetsArr,len,'флот противника');
    fleet2=myFleet=new Fleet(ts,fleetsArr,len,'мой флот');
    fleet2.fleetArr.classList.add('myFleet');
    buttons=drawButtons(fleetsArr);
    },500);
}
function drawFleetsArr(){
    var fleetsArr=document.createElement("div");
    fleetsArr.className='fleetsArr';
    var w=getWH().w;
    var h=getWH().h;
    var rat=w/h;
    var min=(w<=300&&h<=320);
    if ((w<=640 && h>=640)||(w<=470 && h>=470)||(w<=380 && h>=380)||(w<=320 && h>=320)||min)
        rat = 0;
    else
        rat = 1;
    var fleetWidth=(wc*ts+(1+px*rat)*wc)*(2-!rat)+3*wc;
    var fleetHeight=(wc*ts+(1+py*2)*wc)*(2-rat);
    var left = (w-fleetWidth)/2-((w-fleetWidth)/2)%wc;
    if (left<0) left =0;
    fleetsArr.style.marginLeft=left+'px';
    var h=getWH().h;
    var top1 = (h-fleetHeight)/2-((h-fleetHeight)/2)%wc;
    if (top1<0) top1 =0;
    fleetsArr.style.marginTop=top1+'px';
    return fleetsArr;
}

var ms;
var touch;

window.ontouchmove = function(e) {
    e.preventDefault();
};
window.onmousemove = function(e) {
    e.preventDefault();
    e.stopPropagation();
};
window.onmouseup = function(e) {
    ms=false;
};
window.ontouchend = function(e) {
    touch=false;
};
window.oncontextmenu=window.onselectstart=window.ondragstart=function(e){
    return false;
};

var ol;
var ot;
function moveShip(e,sh,fleet){
    if (ms) {
        ol=e.pageX-sh.offsetLeft;
        ot=e.pageY-sh.offsetTop;
    }
    if (touch) {
        ol=e.targetTouches[0].pageX-sh.offsetLeft;
        ot=e.targetTouches[0].pageY-sh.offsetTop;
    }
    document.onmousemove = document.ontouchmove = function(e) {
        moveAt(e,sh,fleet);
    };
};
function moveAt(e,sh,fleet){
    if (!ms&&!touch) return;
    e.preventDefault();
    var n=fleet.ships.indexOf(sh);
    var len=fleet.len[n];
    var vh=fleet.vh[n];
    var dx,dy;
    if(ms){
        dx=e.pageX-ol;
        dy=e.pageY-ot;
    }
    else if (touch){
        dx=e.targetTouches[0].pageX-ol;
        dy=e.targetTouches[0].pageY-ot;
    }
    dx=dx<0?0:dx>wc*(ts-(vh?len:1))?wc*(ts-(vh?len:1)):dx;
    dy=dy<0?0:dy>wc*(ts-(!vh?len:1))?wc*(ts-(!vh?len:1)):dy;
    dx=dx-dx%wc;
    dy=dy-dy%wc;
    fleet.id[n][0]=+(dy/wc+''+dx/wc);
    sh.style.marginLeft = dx+'px';
    sh.style.marginTop = dy+'px';
};

function startGame(){
	fleet2.all=[];
		fleet2.allId=[];
        for (var x=0;x<amt;x++){
             var id=fleet2.id[x][0];
             if (id===undefined) {
     consT.innerHTML='Разместите корабли на поле';
cons.classList.add('visible');
return
}
if (len[x]>1){
	var vh=fleet2.vh[x];
                    for(var l=1;l<len[x];l++)
                        fleet2.id[x][l]=vh?id+l:id+l*ts;
    }
 if (fleet2.check(fleet2.all,x)){
consT.innerHTML='Корабли не должны соприкасаться!';
cons.classList.add('visible');
 return
 }
       }
        fleetsArr.classList.add('startGame');
        fleet1.shRand();
        fleet1.start=1;
        fleet1.turn=1;
};

function drawButtons(fleetsArr){
    var start = document.createElement("div");
    start.className='start';
    start.innerHTML='Начать игру';
    start.onclick=function(){
        startGame();
    };
    fleetsArr.appendChild(start);
    var rand = document.createElement("div");
    rand.className='rand';
    rand.innerHTML='Случайно';
    rand.onclick=function(){
            fleet2.shRand();
    };
    fleetsArr.appendChild(rand);
    var hod = document.createElement("div");
    hod.className='hod';
    hod.innerHTML='Ваш ход';
    fleetsArr.appendChild(hod);
    return {start:start,rand:rand,hod:hod};
}
window.onresize=function(){
    var w=getWH().w;
    var h=getWH().h;
    var rat;
    var min=(w<=300&&h<=320);
    if ((w<=640 && h>=640)||(w<=470 && h>=470)||(w<=380 && h>=380)||(w<=320 && h>=320)||min)
        rat = 0;
    else
        rat = 1;
    wc=getWC();
    var fleetWidth=(wc*ts+(1+px*rat)*wc)*(2-!rat)+3*wc;
    var fleetHeight=(wc*ts+(1+py*2)*wc)*(2-rat);
    var left = (w-fleetWidth)/2-((w-fleetWidth)/2)%wc;
    if (left<0) left =0;
    fleetsArr.style.marginLeft=left+'px';
    var top1 = (h-fleetHeight)/2-((h-fleetHeight)/2)%wc;
    if (top1<0) top1 =0;
    fleetsArr.style.marginTop=top1+'px';
    for (var x = 0; x<amt;x++){
    	fleet1.poseShip(x);
    fleet2.poseShip(x);
    }
}

var kill=function(len){
   var id;
   var id1;
    var m;
    var r;
    do{
        if (len>1){
        	fleet2.kill.sort(function(a,b){return a-b;});
        id=fleet2.kill[0];
        id1=fleet2.kill[len-1];
        m=[id,id1];
        r=Math.floor(Math.random()*2);
            var vh=(((id1-id)<ts)?1:0);
                        id=m[r];
            id1=r?(vh?id+1:id+ts):(vh?id-1:id-ts);
        }
        else{
        	id =fleet2.kill[0];
        m=[id-1,id+1,id-ts,id+ts];
        r=Math.floor(Math.random()*4);
            id1=m[r];
        }
    } while (id1<0||id1>=ts*ts||((id%ts==0)&&(id1%ts==(ts-1)))||((id1%ts==0)&&(id%ts==(ts-1))))
    return fleet2.cells[id1];
};

var fire=function(){
    if (!fleet1.start) return
	fleet2.turn=1;
    setTimeout(function(){
        var len =fleet2.kill.length;
        var cell;
        var id;
        do{
            if (len>0){
                cell=kill(len);
                id =fleet2.cells.indexOf(cell);
            }
            else{
                id=Math.floor(Math.random()*ts*ts);
                cell=fleet2.cells[id];
            }
        } while (fleet2.allFire.indexOf(id)>=0)
        cell.classList.add('fire');
        fleet2.fire(cell);
    },1000);
};

function Fleet (ts,fleetsArr,len,text){
	var let = ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П'];
	var win=['Поздравляю с победой! ','К сожалению, вы проиграли... '];
	var state=['мимо','ранил','убил'];
	var hodT=['Ваш ход', 'Ход противника'];
	this.cells=[];
	this.id=[];
	this.allId=[];
	this.idMiss=[];
	this.all=[];
	this.vh=[];
	this.hits=[];
	this.allHits=0;
	this.allFire=[];
	this.ships=[];
	this.len=len;
	this.n=[];
	this.amt=len.length;
	var fleet=this;
	this.start;
	this.hod=0;
	this.miss=0;
	this.turn;
	this.kill=[];
	var num = document.createElement("div");
    num.className='num';
    var let1 = document.createElement("div");
    let1.className='let';
	var fleetT = document.createElement("div");
    fleetT.className='fleet';
    for (var x = 0; x<ts*ts;x++){
        if (x<ts){
            var cellLet = document.createElement('div');
            cellLet.className='cell';
            cellLet.innerHTML=let[x];
            let1.appendChild(cellLet);
        }
        if (x<this.amt){
        	this.id.push([]);
        this.hits.push(0);
        }
        var cell = document.createElement('div');
        cell.className='cell';
        cell.onclick=function(e){
        	e.preventDefault();
        	if (fleet.start&&fleet.turn)
fleet.fire(this);
}
        if (x%ts==(ts-1)) cell.className+=' lastCellX';
        if (x/ts>=(ts-1)) cell.className+=' lastCellY';
        if (x%ts==0) {
            cell.classList.add('clr');
            var cellNum = document.createElement('div');
            cellNum.className='cell clr';
            cellNum.innerHTML=x/ts+1;
            num.appendChild(cellNum);
        }
        fleetT.appendChild(cell);
        this.cells.push(cell);
    }
    this.fleetArr = document.createElement("div");
    this.fleetArr.className='fleetArr';
    this.shipsArr = document.createElement("div");
    this.shipsArr.className='myShipsArr';
    for (var x = 0; x<this.amt;x++){
        var ship = document.createElement("div");
        ship.className='ship';
        ship.style.marginTop=x*wc+'px';
        ship.onmousedown=function(e){
            e.preventDefault();
            ms=true;
            moveShip(e,this,fleet);
        }
        ship.ontouchstart=function(e){
            e.preventDefault();
            touch=true;
            moveShip(e,this,fleet);
        }
        ship.onmouseup = function() {
            ms=false;
        }
        ship.ontouchend = function() {
            touch=false;
        }
        ship.ondblclick = function(e) {
        	e.preventDefault();
            var n=fleet.ships.indexOf(this);
            fleet.vh[n]=!fleet.vh[n];
            if (fleet.vh[n])
              this.classList.remove('vh');
            else
              this.classList.add('vh');
            ms=true;
            moveAt(e,this,fleet);
            ms=false;
        };
        for (var y=0; y<this.len[x];y++){
            var cell = document.createElement('div');
            cell.className='cell';
            if (y==(this.len[x]-1)) cell.className+=' lastCellX lastCellY';
            ship.appendChild(cell);
            this.n.push(x);
        }
        this.ships.push(ship);
        this.vh.push(1);
        this.shipsArr.appendChild(ship);
    }
    this.fleetArr.appendChild(this.shipsArr);
    var text1 = document.createElement('div');
    text1.innerHTML=text;
    text1.className='fleetName';
    this.state= document.createElement("div");
    this.state.className='state';
    this.state.innerHTML=state[0];
    this.fleetArr.appendChild(let1);
    this.fleetArr.appendChild(num);
    this.fleetArr.appendChild(fleetT);
    this.fleetArr.appendChild(this.state);
    this.fleetArr.appendChild(text1);
    fleetsArr.appendChild(this.fleetArr);
    document.body.appendChild(fleetsArr);
this.shRand=function(){
		this.all=[];
		this.allId=[];
        for (var n = 0; n<this.amt;n++){
           do{
                var vh=Math.floor(Math.random()*2);
                var id=this.id[n][0]=this.rPos(len[n],vh);
                if (len[n]>1){
                    for(var l=1;l<len[n];l++)
                        this.id[n][l]=vh?id+l:id+l*ts;
              }
            } while(this.check(this.all,n));
            this.vh[n]=vh;
            this.poseShip(n);

        };
    };
    this.rPos=function(len,vh){
       var x=Math.floor(Math.random()*(ts-(len-1)*vh));
       var y=Math.floor(Math.random()*(ts-(len-1)*!vh));
       return +(y+''+x);
    };
    this.onCollision=function(a,b){
        if (a.length>0&&b.length>0){
            for (var n = 0,len1=a.length; n<len1;n++){
                for(var l=0,len2=b.length;l<len2;l++){
                    if (a[n]==b[l]) return true;
                }
            }
        }
        return false;
    };
    this.missDraw=function(n){
var k;
var miss=this.idMiss[n];
var len=miss.length;
for (k=0;k<len;k++){
	var cell=this.cells[+miss[k]];
cell.classList.add('miss');
cell.onclick=function(e){
	e.preventDefault();
return false;
}
}
};
    this.shM=function(sh){
        var m=[];
        var n;
        var len1=sh.length;
        	var add=function(k1){
        	if(k1==sh[n-1]||k1==sh[n+1]||(((k%ts)==0)&&((k1%ts)==(ts-1)))||(((k1%ts)==0)&&((k%ts)==(ts-1)))||k1<0||k1>(ts*ts-1)) return;
        for (var l=0,len2=m.length;l<len2;l++){
        	if (k1==m[l]) return;
}
m.push(k1);
}
        for (n=0;n<len1;n++){
        	var k=sh[n];
        add(k-1-ts);
        add(k-1);
        add(k-1+ts);
        add(k+1-ts);
        add(k+1);
        add(k+1+ts);
        add(k-ts);
        add(k+ts);
        }

        return m;
    };
    this.check=function(all,n){
    	var id=this.id[n];
        if (this.onCollision(all,id)) return true;
        var m = this.shM(id);
        this.idMiss[n]=m;
        this.allId=this.allId.concat(id);
        this.all=all.concat(m).concat(id);
        return false;
    };
    this.fire=function(cell){
    	this.state.style.display='block';
        if (this!=myFleet)  myFleet.state.style.display='none';
        else enemyFleet.state.style.display='none';
    	this.hod+=1;
    	var id=this.cells.indexOf(cell);
        this.allFire.push(id);
        var n=this.allId.indexOf(id);
        var n1=this.n[n];
    	if (n>=0){
            cell.classList.add('hit');
            this.state.innerHTML=state[1];
            this.kill.push(id);
            this.hits[n1]+=1;
            if (this.hits[n1]==this.len[n1]){
                this.ships[n1].classList.add('fined');
                this.state.innerHTML=state[2];
                this.kill=[];
                this.missDraw(n1);
                this.allFire=this.allFire.concat(this.idMiss[n1]);
                this.allHits+=1;
                if (this.allHits==this.amt) {
                    if (this!=myFleet) this.win=win[0];
                    else this.win=win[1];
                    consT.innerHTML=this.win+'Всего промахов: '+this.miss;
                    cons.classList.add('visible');
                    enemyFleet.start=0;
                }
            }
            if (this==myFleet) fire();
        }
        else{
            cell.classList.add('miss');
            this.state.innerHTML=state[0];
            this.miss++;
            if (this!=myFleet) {
                fire();
                buttons.hod.innerHTML=hodT[1];
            }
            else {
                enemyFleet.turn=1;
                buttons.hod.innerHTML=hodT[0];
            }
            this.turn=0;
        }
        cell.onclick=function(e){
	e.preventDefault();
return false;
}
    };
    this.poseShip=function(x){
	var n=this.id[x][0];
    var dx,dy;
    var sh=this.ships[x];
    if (n===undefined){
    	dy=x*wc;
    dx=(ts+1)*wc;
    }
    else{
    	dy=Math.floor(n/ts)*wc;
        dx=n%ts*wc;
    }
    	sh.style.marginTop=dy+'px';
        sh.style.marginLeft=dx+'px';
         if (this.vh[x])
                sh.classList.remove('vh');
            else
                sh.classList.add('vh');
};
};