const m1 = 1;
const m2 = 1;
const l1 = 100;
const l2 = 100;
const damping = 0.001;

class doublePendulum extends RK4Solver {
  constructor(initVars, h) {
    super(null, initVars, h);
    this.funcs = [
      this.theta1Func,
      this.theta1DotFunc,
      this.theta2Func,
      this.theta2DotFunc,
    ];

    this.x1 = l1 * sin(this.vars[0]) + width / 2;
    this.y1 = -l1 * cos(this.vars[0]) + height / 2;

    this.x2 = this.x1 + l2 * sin(this.vars[2]);
    this.y2 = this.y1 - l2 * cos(this.vars[2]);

    this.prev = createVector(this.x2, this.y2);
  }

  theta1Func(time, vars) {
    return vars[1];
  }
  theta2Func(time, vars) {
    return vars[3];
  }

  theta1DotFunc(time, vars) {
    let M1 = m1;
    let M2 = m2;
    let theta1 = vars[0];
    let theta2 = vars[2];
    let w1 = vars[1];
    let w2 = vars[3];
    let g = -9.8;
    let L1 = l1;
    let L2 = l2;
    let num =
      -g * (2 * M1 + M2) * sin(theta1) -
      M2 * g * sin(theta1 - 2 * theta2) -
      2 *
        sin(theta1 - theta2) *
        M2 *
        (w2 * w2 * L2 + w1 * w1 * L1 * cos(theta1 - theta2));
    let den = L1 * (2 * M1 + M2 - M2 * cos(2 * theta1 - 2 * theta2));
    return num / den - damping * w1;
  }

  theta2DotFunc(time, vars) {
    let M1 = m1;
    let M2 = m2;
    let theta1 = vars[0];
    let theta2 = vars[2];
    let w1 = vars[1];
    let w2 = vars[3];
    let g = -9.8;
    let L1 = l1;
    let L2 = l2;

    let num =
      2 *
      sin(theta1 - theta2) *
      (w1 * w1 * L1 * (M1 + M2) +
        g * (M1 + M2) * cos(theta1) +
        w2 * w2 * L2 * m2 * cos(theta1 - theta2));
    let den = L2 * (2 * M1 + M2 - M2 * cos(2 * theta1 - 2 * theta2));
    return num / den - damping * w2;
  }

  show(colour = "white") {
    this.x1 = l1 * sin(this.vars[0]) + width / 2;
    this.y1 = -l1 * cos(this.vars[0]) + height / 2;

    this.x2 = this.x1 + l2 * sin(this.vars[2]);
    this.y2 = this.y1 - l2 * cos(this.vars[2]);
    push();
    stroke(colour);
    fill(colour);
    line(this.x1, this.y1, width / 2, height / 2);
    line(this.x1, this.y1, this.x2, this.y2);
    circle(this.x1, this.y1, 10);
    circle(this.x2, this.y2, 10);
    pop();

    trailLayer.push();
    trailLayer.fill(colour);
    trailLayer.stroke(colour);
    trailLayer.line(this.prev.x, this.prev.y, this.x2, this.y2);
    this.prev.set(this.x2, this.y2);
    trailLayer.pop();
  }
}

let step = 0.01;

let pen1;
let pen2;

function setup() {
  // Below arrays are theta1,theta1_dot,theta2,theta2_dot initial positions
  const pen1Init = [0, 0, 0.01, 0];
  const pen2Init = [0, 0, 0.011, 0];
  createCanvas(600, 600);
  background(52);
  trailLayer = createGraphics(600, 600);
  trailLayer.noStroke();
  trailLayer.fill(52, 10);
  pen1 = new doublePendulum(pen1Init, step);
  pen2 = new doublePendulum(pen2Init, step);
}

function draw() {
  background(52);

  trailLayer.rect(0, 0, width, height);
  image(trailLayer, 0, 0);

  for (let i = 0; i < 100; i++) {
    pen1.solve();
    pen2.solve();
  }

  pen1.show(color("#E5BD1A"));
  pen2.show(color("#1A42E5"));
}
