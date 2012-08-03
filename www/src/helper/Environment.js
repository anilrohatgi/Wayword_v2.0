

///////////////////////////////////////////////////////////////////////

function Environment() 
{
    //Env constants..
    this.dx   = 0.2;
    this.vel  = 1;
    
    this.imgW = 500;
    this.imgH = 150;
    
    this.x = 0;
    this.y = 0;
    
    this.clearX = this.imgW;
    this.clearY = this.imgH;
    
    this.dispScore = 0;
    
    this.clouds = new Image();  
    this.clouds.src = 'Media/Clouds.png'; 
    
    this.canvas_back = new Image();  
    this.canvas_back.src = 'Media/Mainmenu_BG.jpg'; 
    
    this.draw       = drawEnv;
    this.drawScore  = drawScore;
    this.setCanvas  = SetCanvas;
}

///////////////////////////////////////////////////////////////////////

function SetCanvas(ctx, canvas)
{
    this.ctx = ctx;
    this.canvas = canvas;
}

///////////////////////////////////////////////////////////////////////

function drawEnv() 
{
    //Draw the background..
    this.ctx.drawImage(this.canvas_back, 0, 0); 
    
    //reset, start from beginning
    if (this.x > (this.canvas.width)) 
    { 
        this.x = this.canvas.width - this.imgW;
    }
        
    //draw aditional image
    if (this.x > (this.canvas.width - this.imgW)) 
    { 
        this.ctx.drawImage(this.clouds, this.x - this.imgW + 1, this.y, this.imgW, this.imgH); 
    }
    
    //draw image
    this.ctx.drawImage(this.clouds, this.x, this.y, this.imgW, this.imgH);
    
    //amount to move
    this.x += this.dx;
    
    //draw other stuff.
    this.drawScore();
}

///////////////////////////////////////////////////////////////////////

function drawScore() 
{
    //Draw your score..
    this.ctx.font = '20pt Futura';
    this.ctx.fillStyle = '#FFFFFF';
    
    //Draw your score..
    var userData = MainApp.app.database.getUserData();
    if (userData != null)
    {
        var realScore = userData['score'];
        var diff = realScore - this.dispScore;
        var mod = 1.0;
        
        if (diff > 50) mod = 10.0;
        if (this.dispScore < realScore)
        {
            this.dispScore += mod; 
            this.ctx.fillStyle = '#FF0000';
        }
    }
    
    var scoreStr = 'Score : ' + this.dispScore;    
    this.ctx.shadowColor = '#000';
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 10;
    this.ctx.fillText(scoreStr, 10, 40);
    
    //Disable the shadows now..
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
}