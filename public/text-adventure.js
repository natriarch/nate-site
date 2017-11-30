$(document).ready(function() {

    var outElement = document.getElementById('output');
    var inElement = document.getElementById('input');
    var myDisp = new Display(inElement, outElement);

    var scene1 = new Scene('You are in an small room containing only a large box and a door. What you do?'); 
    var scene1LookBox = new Scene('A black metal box. One of the top edges is hinged', 'examine box');
    var scene1OpenBox = new Scene('the box opens. Inside you find another box', 'open box');
    var scene1ClimbBox  = new Scene('with some effort, you climb atop the box', 'climb box');
    scene1LookBox.addNext(scene1);
    scene1ClimbBox.addNext(scene1);
    scene1OpenBox.addNext(scene1);

    //Example of a scene effect. Scenes can have effects that are user defined functions that
    //alter the status of some other thing. ex. Kill player, change text of a scene when something happens.
    //scripting stuff
    scene1OpenBox.addEffect(function() {
        scene1.content = 'the corners of the room now glow faintly with pulsating green light';
        scene1.displayed = false;
    });
    
    scene1.addNext(scene1LookBox);
    scene1.addNext(scene1OpenBox);
    scene1.addNext(scene1ClimbBox);

    var myDir = new Director(scene1, myDisp);
    
    $(inElement).keydown(function (e) {
        if (e.which == 13) {
            myDir.currentInput = inElement.value;
            console.log('enter pressed. input: ' + myDir.currentInput);
            myDir.myDisplay.printUserInput(myDir.currentInput, 0, myDir.checkInput);
        }
    });

    myDir.myDisplay.outBox.value = '';
    myDir.runStory(); 
});




//Think scenes of a movie.
//todo: hints, multiple content strings
function Scene(text, key) {

    this.content = text;
    this.key = key;
    this.next = [];
    this.previous;
    this.effects = [];
    this.displayed = false;
}

//link this scene to the next one. Can be circularly linked.
Scene.prototype.addNext = function(sc) {

    this.next.push(sc);
}

//effects are functions. Each scene has a list of effects that happen when the scene is activated.
Scene.prototype.addEffect = function(eff) {

    this.effects.push(eff);
}

function Display(inEl, outEl) {

    this.inBox = inEl;
    this.outBox = outEl;

    this.inBox.disabled = true;
}

Display.prototype.print = function(text, speed, cb) {

        var that = this;
        var output = text;
        var callback = cb;

        console.log('displaying: ' + text);
        this.outBox.value += '\r\n\r\n';
        this.inBox.disabled = true;
        
        //helper method used to bind the correct value of i in our loop to our function            
        var helper = function(x) {
            var index = x;
            return function() {
                that.outBox.value += output.charAt(x);
				that.outBox.scrollTop = that.outBox.scrollHeight;
                if (index === output.length - 1) {
                    that.inBox.disabled = false;
                    callback();
                }
            };
        }

        //loop through text and display each char after a delay
        for (var i = 0; i < text.length; i++) {      
            setTimeout(helper(i), i * speed);
        }
}

Display.prototype.printUserInput = function(text, speed, cb) {

        var that = this;
        var output = text;
        var callback = cb;

        console.log('displaying: ' + text);
        this.outBox.value += '\r\n\r\n  ~ ';
        this.inBox.disabled = true;
        
        //helper method used to bind the correct value of i in our loop to our function            
        var helper = function(x) {
            var index = x;
            return function() {
                that.outBox.value += output.charAt(x);
				that.outBox.scrollTop = that.outBox.scrollHeight;
                if (index === output.length - 1) {
                    that.inBox.disabled = false;
                    callback();
                }
            };
        }

        //loop through text and display each char after a delay
        for (var i = 0; i < text.length; i++) {      
            setTimeout(helper(i), i * speed);
        }
}

var Director = function(scn, disp, p) {

    var that = this;

    this.currentScene = scn;
    this.myDisplay = disp;
    this.myPlayer = p; 
    this.currentInput;
    this.gettingInput = false;

    this.checkInput = function() {

        for (var i = 0; i < that.currentScene.next.length; i ++) {
            if (that.currentInput.toLowerCase() === that.currentScene.next[i].key.toLowerCase()) {
                console.log('input valid!');
                that.currentScene = that.currentScene.next[i];
                that.runStory();
            }
        }
    }
 
    this.runStory = function() {

        if (!that.currentScene.displayed){
            that.myDisplay.print(that.currentScene.content, 20, that.runStory);
            for (var i = 0; i < that.currentScene.effects.length; i++) {
                that.currentScene.effects[i]();
            }
            that.currentScene.displayed = true;
        }   
        for (var i = 0; i < that.currentScene.effects.length; i++) {
            that.currentScene.effects[i]();
        } 

        if (that.currentScene.next.length === 1) {
            that.currentScene = that.currentScene.next[0];
        } 
    }
}

var Player = function() {

    this.inventory = [];
    this.state = '';
}

Player.prototype.setState = function(txt) {

    this.state = txt;
}    
