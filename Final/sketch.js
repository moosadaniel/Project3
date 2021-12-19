let cam;
let poseNet;
let handL, handR;

let BG;
let movers = [];
let pics = [];
let sounds = [];

let data;

let names = [];
let text1 = [];
let text2 = [];
let text3 = [];

let text4 = [];
let text5 = [];
let text6 = [];
let text7 = [];
let text8 = [];

function preload() {
    BG = loadImage("resource/background.jpg");
    bgCover = loadImage("resource/linedbackground.png");
    clownfish = loadImage("resource/clownfish.png");
    lionfish = loadImage("resource/lionfish.png");
    line1 = loadImage("resource/lineone.png");
    line2 = loadImage("resource/linetwo.png");
    neon = loadImage("resource/neontetra.png");
    angel = loadImage("resource/angelfish.png");

    pianoA = loadSound("resource/piano-a_A_major.wav");
    pianoB = loadSound("resource/piano-b_B_major.wav");
    pianoC = loadSound("resource/piano-c_C_major.wav");
    pianoD = loadSound("resource/piano-d_D_major.wav");

    data = loadTable('resource/text.csv', 'csv', 'header');
}

setup = () => {
    createCanvas(windowWidth, windowHeight);
    cam = createCapture(VIDEO);
    cam.hide();
    cam.size(windowWidth, windowHeight);
    poseNet = ml5.poseNet(cam, {
        flipHorizontal: true //flips interaction
    }, modelReady);
    poseNet.on('pose', gotPoses);

    handL = createVector(width / 2, height / 2);
    handR = createVector(width / 2, height / 2);

    noStroke();

    mover = createVector(0, height / 2);

    pics.push(clownfish);
    pics.push(lionfish);
    pics.push(line1);
    pics.push(line2);
    pics.push(neon);
    pics.push(angel);

    sounds.push(pianoA);
    sounds.push(pianoB);
    sounds.push(pianoB);
    sounds.push(pianoB);
    sounds.push(pianoC);
    sounds.push(pianoD);

    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER);


    for (let i = 0; i < data.getColumnCount(); i++) {

        names[i] = data.getString(0, i);

        text1[i] = data.getString(1, i);
        text2[i] = data.getString(2, i);
        text3[i] = data.getString(3, i);
        text4[i] = data.getString(4, i);

        text5[i] = data.getString(5, i);
        text6[i] = data.getString(6, i);
        text7[i] = data.getString(7, i);
        text8[i] = data.getString(8, i);
    }

    for (let i = 0; i < pics.length; i++) {
        movers[i] = new Mover(-random(width), height / 25 * i + height / 3, pics[i], sounds[i], names[i], text1[i], text2[i], text3[i], text4[i], text5[i], text6[i], text7[i], text8[i]);
    }
}

let gotPoses = (poses) => {
    //console.log(poses);
    //only detect if there is a person
    if (poses.length > 0) {
        handL.x = lerp(poses[0].pose.keypoints[9].position.x, handL.x, 0.5);
        handL.y = lerp(poses[0].pose.keypoints[9].position.y, handL.y, 0.5);
        handR.x = lerp(poses[0].pose.keypoints[10].position.x, handR.x, 0.5);
        handR.y = lerp(poses[0].pose.keypoints[10].position.y, handR.y, 0.5);
    }
}

let modelReady = () => {
    console.log('model ready');
}

draw = () => {

    //flip the video to match interaction
    // push();
    // translate(windowWidth, 0);
    // scale(-1.0, 1.0);
    // image(cam, 0, 0);
    // scale(1.0, 1.0);
    // pop();
    //Fade background
    // fill(250, 250, 250, 200);
    // rect(0, 0, width, height);
    background(BG);
    image(BG, width / 2, height / 2, width, height);

    for (let mover of movers) {
        mover.update();
        mover.display();
    }

    image(bgCover, width / 2, height / 2, width, height);


    fill(255, 0, 0, 100);
    circle(handR.x, handR.y, 25);



}


class Mover {
    constructor(x, y, pic, sound, name, t1, t2, t3, t4, t5, t6, t7, t8) {
        this.position = createVector(x, y);
        this.velocity = createVector(random(2, 3), 0);
        this.acceleration = createVector(0, 0);
        this.pic = pic;
        this.hovered = false;
        this.HoverWidth = 0;
        this.scale = height / 2500;
        this.sound = sound;

        this.name = name;

        this.t1 = t1;
        this.t2 = t2;
        this.t3 = t3;
        this.t4 = t4;

        this.t5 = t5;
        this.t6 = t6;
        this.t7 = t7;
        this.t8 = t8;
    }

    update() {
        if (dist(this.position.x, this.position.y, handR.x, handR.y) < this.pic.width / 5) {
            this.hovered = true;
        } else {
            this.hovered = false;
            this.scale = height / 2500;
        }

        if (this.hovered) {
            let currentPos = this.position;
            this.position = currentPos;

            if (this.HoverWidth < this.pic.width * this.scale) {
                this.HoverWidth += 1;
            } else {
                this.HoverWidth = this.pic.width * this.scale;
                this.scale = 1.1 * height / 2500;

                this.sound.play();

                push();
                fill(255);
                textSize(20);
                text(this.name, this.position.x, this.position.y - this.pic.height / 5);
                textSize(15);
                text(this.t1, this.position.x - this.pic.width / 3, this.position.y - height / 50);
                text(this.t2, this.position.x - this.pic.width / 3, this.position.y - height / 50 + 25);
                text(this.t3, this.position.x - this.pic.width / 3, this.position.y - height / 50 + 50);
                text(this.t4, this.position.x - this.pic.width / 3, this.position.y - height / 50 + 75);

                text(this.t5, this.position.x + this.pic.width / 3, this.position.y - height / 50);
                text(this.t6, this.position.x + this.pic.width / 3, this.position.y - height / 50 + 25);
                text(this.t7, this.position.x + this.pic.width / 3, this.position.y - height / 50 + 50);
                text(this.t8, this.position.x + this.pic.width / 3, this.position.y - height / 50 + 75);
                pop();
            }

            // if (mouseIsPressed) {

            // }

        } else {
            this.HoverWidth = 0;
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            this.acceleration.mult(0);
            if (this.position.x > width) {
                this.position.x = 0;
            }
        }
    }

    display() {

        image(this.pic, this.position.x, this.position.y, this.pic.width * this.scale, this.pic.height * this.scale);

        if (this.pic != line1 && this.pic != line2) {

            push();
            fill(255, 50);
            noStroke();
            rect(this.position.x, this.position.y + this.pic.height / 5, this.pic.width * this.scale, this.pic.width / 6 * this.scale, 5, 5);
            pop();

            if (this.hovered) {
                fill("#85dde9");
                noStroke();
                rect(this.position.x, this.position.y + this.pic.height / 5, this.HoverWidth, this.pic.width / 6 * this.scale, 5, 5);
                textSize(this.pic.width / 25);
                fill(255);
                text("", this.position.x, this.position.y + this.pic.height / 4.5);
            }
        }
    }
}
