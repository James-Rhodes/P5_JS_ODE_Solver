class RK4Solver {
  // funcs should be the evolution equation of initVars.
  // eg. initVars = [x,dx/dt,y,dy/dt] where x is x position, dx/dt is the derivative
  // of x, y is the y position and dy/dt is the derivative of y.
  // funcs should be an array of functions that defines how x,dx/dt,y,dy/dt change over time (there derivatives)
  constructor(funcs, initVars, h) {
    this.funcs = funcs;
    this.vars = initVars;
    this.h = h;
    this.time = 0;
  }

  k0Gen(funcs, vars, time, h) {
    let k0s = [];
    for (let i = 0; i < funcs.length; i++) {
      k0s.push(h * funcs[i](time, vars));
    }

    return k0s;
  }
  k1Gen(funcs, vars, time, h, k0) {
    let k1s = [];
    let updatedVars = [];
    for (let i = 0; i < vars.length; i++) {
      updatedVars.push(vars[i] + 0.5 * h * k0[i]);
    }
    for (let i = 0; i < funcs.length; i++) {
      k1s.push(h * funcs[i](time + 0.5 * h, updatedVars));
    }
    return k1s;
  }

  k2Gen(funcs, vars, time, h, k1) {
    let k2s = [];
    let updatedVars = [];
    for (let i = 0; i < vars.length; i++) {
      updatedVars.push(vars[i] + 0.5 * h * k1[i]);
    }
    for (let i = 0; i < funcs.length; i++) {
      k2s.push(h * funcs[i](time + 0.5 * h, updatedVars));
    }
    return k2s;
  }

  k3Gen(funcs, vars, time, h, k2) {
    let k3s = [];
    let updatedVars = [];

    for (let i = 0; i < vars.length; i++) {
      updatedVars.push(vars[i] + h * k2[i]);
    }
    for (let i = 0; i < funcs.length; i++) {
      k3s.push(funcs[i](time + h, updatedVars));
    }

    return k3s;
  }

  solve() {
    //h is time step
    let k0 = this.k0Gen(this.funcs, this.vars, this.time, this.h);
    let k1 = this.k1Gen(this.funcs, this.vars, this.time, this.h, k0);
    let k2 = this.k2Gen(this.funcs, this.vars, this.time, this.h, k1);
    let k3 = this.k3Gen(this.funcs, this.vars, this.time, this.h, k2);

    let updatedVars = [];

    for (let i = 0; i < this.vars.length; i++) {
      updatedVars.push(
        this.vars[i] +
          this.h * ((1 / 6) * (k0[i] + 2 * k1[i] + 2 * k2[i] + k3[i]))
      );
    }
    this.time += this.h;
    this.vars = updatedVars.slice();
    return updatedVars;
  }
}
