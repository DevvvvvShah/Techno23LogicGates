/* global $ Snap */
(function() {
  "use strict";

  var Utils = {
    extend: function(constructor, superConstructor) {
      function SurrogateConstructor() {}

      SurrogateConstructor.prototype = superConstructor.prototype;

      var prototypeObject = new SurrogateConstructor();
      prototypeObject.constructor = constructor;

      constructor.prototype = prototypeObject;
    }
  };

  window.CIRCUIT_CONSTANTS = {
    VALCLASS: {true: "lechef-value-true",
              false: "lechef-value-false",
              UNKNOWN: "lechef-value-unknown",
              null: "lechef-value-unknown"},
    FEEDBACKCLASS: { true: "lechef-value-correct",
                    false: "lechef-value-incorrect"}
  };
  // Connector in the logic circuit from one component's output to
  // another's input. *DO NOT* modify the inputs and outputs through
  // this object.
  //
  // The path of the connector is an SVG path, drawn with Snap.SVG.
  //
  // The useful functions are to position the path and to set the
  // value (to make it visually different when there's 'current' in
  // the wire.
  var CircuitConnection = function(outOf, outOfPos, into, intoPos, options) {
    this._outOf = outOf;
    this._outOfPos = outOfPos;
    this._into = into;
    this._intoPos = intoPos;
    var path = outOf.circuit._snap.path("M0 0 L 100 100");
    path.addClass("lechef-connector");
    if (typeof options === "object" && options.connectorRemoveAllowed) {
      path.dblclick(this.remove.bind(this));
    }
    this._path = path;
    this.positionPath();
  };
  // Re-calculates the position of this path. In case you want to do some more
  // intelligent drawing, this would be a good function to overwrite :)
  CircuitConnection.prototype.positionPath = function() {
    var end = this._into._getInputLocation(this._intoPos);
    var start = this._outOf._getOutputLocation(this._outOfPos);
    var endPos = this._into.element.position();
    var startPos = this._outOf.element.position();
    var endX = end.x + endPos.left,
      endY = end.y + endPos.top,
      startX = start.x + startPos.left,
      startY = start.y + startPos.top,
      ctrl1X, ctrl2X;
    ctrl1X = startX + 80;
    ctrl2X = endX - 80;
    this._path.attr("path", "M" + startX + " " + startY + // move to the starting point
                      " C" + ctrl1X + " " + startY + // cubic bezier, first control point
                      " " + ctrl2X + " " + endY + // cubic bezier, second control point
                      " " + endX + " " + endY);
  };
  // Set the value of this connector. The value should be either true or false.
  CircuitConnection.prototype.setValue = function(value) {
    this._path.addClass(CIRCUIT_CONSTANTS.VALCLASS[value]);
  };
  // Clear the value.
  CircuitConnection.prototype.clearValue = function() {
    this._path.removeClass([CIRCUIT_CONSTANTS.VALCLASS[true], CIRCUIT_CONSTANTS.VALCLASS[false]].join(" "));
  };
  // Remove this connector.
  CircuitConnection.prototype.remove = function() {
    this._into.removeInput(this._intoPos);
  };
  // Destroy this connector. This will remove the SVG path used.
  CircuitConnection.prototype.destroy = function() {
    this._path.remove();
  };

  // The super type for all the circuit components. No instances of
  // this type should be directly created. Instead, you should create
  // the actual components, like NotComponent.
  //
  // Subtypes should make sure they call the init(circuit, options)
  // function in their constructor (unless you know what you're doing).
  // Subtypes should also always implement two functions:
  //  - drawComponent: this function should draw the shape of the component
  //                  *and* position the input and output connector elements
  //                  appropriately
  //  - calculateOutput(input): this function should return the output of the
  //                  component. Note, that the input is an array of
  //                  input for this component.
  var CircuitComponent = function(circuit, options) {
    this.init(circuit, options);
  };
  var compproto = CircuitComponent.prototype;
  // Initialized a circuit component. Circuit should be
  // an instance of LogicCircuit. The options is an optional object configuring
  // the component. Supported options are:
  //  - inputCount:
  //  - output:
  //  - element:
  //  - classNames:
  compproto.init = function(circuit, options) {
    this.circuit = circuit;
    this.options = $.extend({draggable: true, clearFeedbackOnDrag: false, inputCount: 2, outputCount: 1}, options);
    var svgId = "LCC" + new Date().getTime();
    var element = $("<div><svg id='" + svgId +
                    "'></svg><span class='lechef-label'>" + this._componentName.toUpperCase() +
                                            "</span></div>");
    element.addClass("lechef-component");
    element.addClass("lechef-" + this._componentName);
    if (options && options.classNames) { element.addClass(options.classNames); }
    this.element = element;
    if (!this.options.element) {
      this.circuit.element.append(element);
    }
    if (!this.element[0].id) { this.element[0].id = "LC" + new Date().getTime(); }
    this._snap = new Snap("#" + svgId);
    if ("left" in this.options) { this.element.css("left", this.options.left); }
    if ("top" in this.options) { this.element.css("top", this.options.top); }

    this._outputs = [];
    this._outputpaths = [];
    this._outputElements = [];
    this._outputCount = this.options.outputCount;
    for (var i = 0; i < this._outputCount; i++) {
      var output = $("<div />")
                .addClass("lechef-output lechef-missing")
                .attr("data-pos", i);
      this.element.append(output);
      this._outputElements[i] = output;
    }

    this._inputs = [];
    this._inputpaths = [];

    this._inputElements = [];
    this._inputCount = this.options.inputCount;
    for (i = 0; i < this._inputCount; i++ ) {
      var input = $("<div />")
                .addClass("lechef-input lechef-missing")
                .attr("data-pos", i);
      this._inputElements[i] = input;
      this.element.append(input);
      this._inputs.push(null);
    }
    // draw the component shape inside the element
    this.drawComponent();

    // make draggable if option set
    if (this.options.draggable) {
      this._draggable();
    }
  };
  // dummy implementation for the drawComponent
  compproto.drawComponent = function() {
    console.error("Circuit components should implement drawComponent!");
  };
  compproto._outputComponent = function(outpos, comp, path) {
    if (!this._outputs[outpos]) {
      this._outputs[outpos] = [];
      this._outputpaths[outpos] = [];
    }
    this._outputs[outpos].push(comp);
    this._outputpaths[outpos].push(path);
    this._outputElements[outpos].removeClass("lechef-missing");
  };
  compproto.inputComponent = function(inpos, outpos, comp, opts) {
    if (typeof outpos === "object") {
      comp = outpos;
      outpos = 0;
    }
    if (inpos >= this._inputCount || // invalid position, return
        outpos >= comp._outputCount) { return; }
    this.removeInput(inpos);

    this._inputs[inpos] = comp;
    var path = new CircuitConnection(comp, outpos, this, inpos, opts);
    this._inputpaths[inpos] = path;
    this._inputElements[inpos].removeClass("lechef-missing");
    comp._outputComponent(outpos, this, path);
  };
  compproto._removeOutput = function(comp) {
    for (var i = this._outputs.length; i--; ) {
      var ind = this._outputs[i].indexOf(comp);
      if (ind !== -1) {
        this._outputs[i].splice(ind, 1);
        this._outputpaths[i].splice(ind, 1);
        if (this._outputs[i].length === 0) {
          this._outputElements[i].addClass("lechef-missing");
        }
      }
    }
  };
  compproto.removeInput = function(pos) {
    if (this._inputs[pos]) {
      this._inputs[pos]._removeOutput(this);
      this._inputpaths[pos].destroy();
      this._inputs[pos] = null;
      this._inputpaths[pos] = null;
      this._inputElements[pos].addClass("lechef-missing");
    }
  };
  compproto.getOutputComponents = function(pos) {
    if (pos < 0 || pos >= this._outputs.length) {
      return [];
    } else {
      return this._outputs[pos];
    }
  };
  compproto.remove = function() {
    var i, j, k, o, c;
    // remove all inputs to this component
    for (i = this._inputs.length; i--; ) {
      this.removeInput(i);
    }
    // Connections are defined by the component they are input to.
    // So, we go through all outputs of this component and all the
    // components the outputs are connected (2nd loop). Then we go
    // through the inputs of that component and try to find this
    // component (which we are removing). If we find this component,
    // we remove it as input. Simple, right ;)
    for (i = this._outputs.length; i--; ) {
      o = this._outputs[i];
      for (j = o.length; j--; ) {
        c = o[j];
        for (k = c._inputs.length; k--; ) {
          if (this === c._inputs[k]) {
            c.removeInput(k);
            break;
          }
        }
        //this._removeOutput(o[j]);
      }
    }
    //console.log(this);
    this.element.remove();
  };
  compproto._getOutputLocation = function(pos) {
    var e = this._outputElements[pos],
        ePos = e.position(),
        w = e.outerWidth(),
        h = e.outerHeight();
    return { x: ePos.left + w/2.0, y: ePos.top + h/2.0 };
  };
  compproto._getInputLocation = function(pos) {
    var e = this._inputElements[pos],
        ePos = e.position(),
        w = e.outerWidth(),
        h = e.outerHeight();
    return { x: ePos.left + w/2.0, y: ePos.top + h/2.0 };
  };
  compproto._positionHandles = function(drawLines) {
    this._positionInputHandles(drawLines);
    this._positionOutputHandles();
  };
  compproto._positionInputHandles = function(drawLines) {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight(),
        i = this._inputCount,
        inputspacing = 0.8*h / (i + 1);
    if (drawLines) {
      for (; i--;) {
        this._snap.line(0, 0.1 * h + inputspacing * (i + 1), 0.2 * w, 0.1 * h + inputspacing * (i + 1));
      }
    }
    for (i = 0; i < this._inputCount; i++) {
      var ie = this._inputElements[i];
      ie.css("top", (0.1 * h + inputspacing * (i + 1) - ie.outerHeight() / 2.0) + "px");
    }
  };
  compproto._positionOutputHandles = function() {
    var h = this.element.outerHeight(),
        i = this._outputCount,
        outputspacing = 0.8*h / (i + 1);
    for (i = 0; i < this._outputCount; i++) {
      var oe = this._outputElements[i];
      oe.css("top", (0.1*h) + outputspacing*(i+1) - oe.outerHeight()/2.0 + "px");
    }
  };
  compproto.layout = function() {
    for (var i = this._inputs.length; i--; ) {
      var input = this._inputs[i],
          inputpath = this._inputpaths[i];
      if (input && inputpath) {
        inputpath.positionPath();
      }
    }
    var outs;
    for (i = this._outputs.length; i--; ) {
      outs = this._outputs[i];
      if (!outs) { continue; }
      for (var j = 0; j < outs.length; j++) {
        var output = outs[j],
             outputpath = this._outputpaths[i][j];
        if (output && outputpath) {
          outputpath.positionPath();
        }
      }
    }
  };
  compproto.validateInputs = function() {
    for (var i = this._inputCount; i--; ) {
      var input = this._inputs[i];
      if (!input) {
        return false;
      }
    }
    return true;
  };
  compproto._setPathValues = function() {
    var val, i, j, paths;
    for (i = this._outputpaths.length; i--; ) {
      val = arguments[i];
      paths = this._outputpaths[i];
      for (j = paths.length; j--; ) {
        paths[j].setValue(val);
      }
    }
  };
  compproto.state = function() {
    return $.extend({name: this._componentName},
                    this.options,
                    {left: this.element.css("left"), top: this.element.css("top")});
  };
  compproto._draggable = function() {
    this.element.draggable({
      start: function() {
        if (this.options.clearFeedbackOnDrag) {
          self.circuit.clearFeedback();
        }
      }.bind(this),
      drag: function() {
        this.layout();
      }.bind(this),
      stop: function() {
        this.circuit.element.trigger("lechef-circuit-changed");
      }.bind(this)
    });
  };
  compproto.simulateOutput = function(inputValue, inputComp) {
    if (!this._inputSimulation) {
      this._inputSimulationCompsLeft = $.extend([], this._inputs);
      this._inputSimulation = [];
    }
    var inputPos = this._inputSimulationCompsLeft.indexOf(inputComp);
    if (inputPos === -1) { return; }
    this._inputSimulation[inputPos] = inputValue;
    this._inputSimulationCompsLeft[inputPos] = undefined;

    this._inputElements[inputPos].addClass(CIRCUIT_CONSTANTS.VALCLASS[inputValue]);

    // function for $.map which will filter out undefined values and replace others with true
    // so it can be used to count the number of values which are not undefined
    // - inputs already dealt with will be undefined
    // - inputs not specified (no connector) will be null
    var undefinedFilter = function(item) { 
      return (typeof item  === "undefined")?undefined:true;
    };
    // if we don't have any un-specified inputs, proceed with calculating the output
    if ($.map(this._inputSimulationCompsLeft, undefinedFilter).length === 0) {
      var result = this.calculateOutput(this._inputSimulation);
      this._setPathValues(result);
      for (var i = 0; i < this._outputElements.length; i++) {
        this._outputElements[i].addClass(CIRCUIT_CONSTANTS.VALCLASS[result[i]]);
        if (this._outputs[i]) {
          for (var j = 0; j < this._outputs[i].length; j++) {
            this._outputs[i][j].simulateOutput(result[i], this);
          }
        }
      }
    }
  };

  var CircuitAndComponent = function(circuit, options) {
    this._componentName = "and";
    //var opts = $.extend({outputCount: 2}, options);
    this.init(circuit, options);
  };
  Utils.extend(CircuitAndComponent, CircuitComponent);
  CircuitAndComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    this._snap.path("M" + 0.2*w + "," + 0.1*h + // move to x y
                           " L" + 0.5*w + "," + 0.1*h + // line to x y
                           " A" + 0.4*h + "," + 0.4*h + " 0 0 1 " +
                                  0.5*w + "," + 0.9*h +
                           " L" + 0.2*w + "," + 0.9*h + "Z");
    this._snap.line(0.8*w-3, 0.5*h, w, 0.5*h);

    this._positionHandles(true);
  };
  CircuitAndComponent.prototype.calculateOutput = function(inputs) {
    var result = true;
    for (var i = 0; i < inputs.length; i++) {
      result = result && inputs[i];
    }
    return [result];
  };

  var CircuitNandComponent = function(circuit, options) {
    this._componentName = "nand";
    this.init(circuit, options);
  };
  Utils.extend(CircuitNandComponent, CircuitComponent);
  CircuitNandComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    this._snap.path("M" + 0.2*w + " " + 0.1*h + // move to x y
                          " L" + 0.5*w + " " + 0.1*h + // line to x y
                          " A" + 0.4*h + " " + 0.4*h + " 0 0 1 " +
                          0.5*w + " " + 0.9*h +
                          " L" + 0.2*w + " " + 0.9*h + "Z");
    this._snap.line(0.9*w-2, 0.5*h, w, 0.5*h);
    this._snap.circle(0.8*w + 2, 0.5*h, 4);

    this._positionHandles(true);
  };
  CircuitNandComponent.prototype._andCalculateOutput = CircuitAndComponent.prototype.calculateOutput;
  CircuitNandComponent.prototype.calculateOutput = function(input) {
    var out = !(this._andCalculateOutput(input)[0]);
    return [out];
  };

  var CircuitNotComponent = function(circuit, options) {
    this._componentName = "not";
    var opts = $.extend({inputCount: 1}, options);
    this.init(circuit, opts);
  };
  Utils.extend(CircuitNotComponent, CircuitComponent);
  CircuitNotComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();

    this._snap.circle(0.7*w + 5, 0.5*h, 4);
    this._snap.polygon([0.2*w, 0.1*h, 0.2*w, 0.9*h, 0.7*w, 0.5*h]);
    this._snap.line(0.7*w + 11, 0.5*h, w, 0.5*h);

    this._positionHandles(true);
  };
  CircuitNotComponent.prototype.calculateOutput = function(inputs) {
    return [!inputs[0]];
  };

  var CircuitOrComponent = function(circuit, options) {
    this._componentName = "or";
    this.init(circuit, options);
  };
  Utils.extend(CircuitOrComponent, CircuitComponent);
  CircuitOrComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    this._snap.line(0.7*w + 10, 0.5*h, w, 0.5*h);
    this._snap.path("M" + 0.2*w + " " + 0.1*h + // move to x y)
                    " Q" + 0.6*w + " " + 0.15*h + " " + 0.8*w + " " + 0.5*h +
                    " Q" + 0.6*w + " " + 0.85*h + " " + 0.2*w + " " + 0.9*h +
                    " Q" + 0.3*w + " " + 0.5*h + " " + 0.2*w + " " + 0.1*h);

    var i = this._inputCount,
        inputspacing = 0.8*h / (i + 1);
    for (; i--;) {
      // magic number 3; should calculate the intersection of the bezier and the line
      this._snap.line(0, 0.1 * h + inputspacing * (i + 1), 0.2 * w + 3, 0.1 * h + inputspacing * (i + 1));
    }

    this._positionHandles(false);
  };
  CircuitOrComponent.prototype.calculateOutput = function(inputs) {
    var result = inputs[0];
    for (var i = 1; i < inputs.length; i++) {
      result = result || inputs[i];
    }
    return [result];
  };

  var CircuitNorComponent = function(circuit, options) {
    this._componentName = "nor";
    this.init(circuit, options);
  };
  Utils.extend(CircuitNorComponent, CircuitComponent);
  CircuitNorComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    this._snap.line(0.75*w + 11, 0.5*h, w, 0.5*h);
    this._snap.path("M" + 0.2*w + " " + 0.1*h + // move to x y)
                    " Q" + 0.5*w + " " + 0.15*h + " " + 0.75*w + " " + 0.5*h +
                    " Q" + 0.5*w + " " + 0.85*h + " " + 0.2*w + " " + 0.9*h +
                    " Q" + 0.3*w + " " + 0.5*h + " " + 0.2*w + " " + 0.1*h);
    this._snap.circle(0.75*w + 5, 0.5*h, 4);

    var i = this._inputCount,
      inputspacing = 0.8*h / (i + 1);
    for (; i--;) {
      // magic number 3; should calculate the intersection of the bezier and the line
      this._snap.line(0, 0.1 * h + inputspacing * (i + 1), 0.2 * w + 3, 0.1 * h + inputspacing * (i + 1));
    }

    this._positionHandles(false);
  };
  // output simulation; reuse what the or component would return and negate it
  CircuitNorComponent.prototype._orCalculateOutput = CircuitOrComponent.prototype.calculateOutput;
  CircuitNorComponent.prototype.calculateOutput = function(input) {
    var orResult = this._orCalculateOutput(input);
    return [!orResult[0]];
  };


  var CircuitXorComponent = function(circuit, options) {
    this._componentName = "xor";
    this.init(circuit, options);
  };
  Utils.extend(CircuitXorComponent, CircuitComponent);
  CircuitXorComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
      h = this.element.outerHeight();
    this._snap.line(0.75*w + 11, 0.5*h, w, 0.5*h);
    this._snap.path("M" + 0.25*w + " " + 0.1*h + // move to x y)
                    " Q" + 0.6*w + " " + 0.15*h + " " + 0.85*w + " " + 0.5*h +
                    " Q" + 0.6*w + " " + 0.85*h + " " + 0.25*w + " " + 0.9*h +
                    " Q" + 0.35*w + " " + 0.5*h + " " + 0.25*w + " " + 0.1*h);
    this._snap.path("M" + 0.2*w + " " + 0.1*h +
                    " Q" + 0.3*w + " " + 0.5*h + " " + 0.2*w + " " + 0.9*h);
    var i = this._inputCount,
      inputspacing = 0.8*h / (i + 1);
    for (; i--;) {
      // magic number 3; should calculate the intersection of the bezier and the line
      this._snap.line(0, 0.1 * h + inputspacing * (i + 1), 0.2 * w + 3, 0.1 * h + inputspacing * (i + 1));
    }

    this._positionHandles(false);
  };
  CircuitXorComponent.prototype.calculateOutput = function(inputs) {
    var in1 = inputs[0],
        in2 = inputs[1];
    return [( in1 && !in2 ) || ( !in1 && in2 )];
  };

  var CircuitAddComponent = function(circuit, options) {
    this._componentName = "add";
    var opts = $.extend({outputCount: 2}, options);
    this.init(circuit, opts);
  };
  Utils.extend(CircuitAddComponent, CircuitComponent);
  CircuitAddComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    // output line
    this._snap.line(0.7*w, 0.5*h, w, 0.5*h);
    // output line downward
    this._snap.line(0.45*w, 0.8*h, 0.45*w, h);
    // the component "body"
    this._snap.rect(0.2*w, 0.2*h, 0.5*w, 0.6*h);

    this._positionInputHandles(true);
    this._outputElements[0].css({"top": 0.5*h - 0.5*this._outputElements[0].outerHeight(),
                                  "right": -0.5*this._outputElements[0].outerWidth()});
    this._outputElements[1].css({"bottom": -0.5*this._outputElements[1].outerHeight(),
                                  "left": 0.45*w - 0.5*this._outputElements[1].outerWidth()});
  };
  CircuitAddComponent.prototype.calculateOutput = function(inputs) {
    var in1 = inputs[0],
        in2 = inputs[1];
    return [( in1 && !in2 ) || ( !in1 && in2 ), in1&&in2];
  };


  var CircuitTwosComponent = function(circuit, options) {
    this._componentName = "twos";
    var opts = $.extend({outputCount: 2}, options);
    this.init(circuit, opts);
  };
  Utils.extend(CircuitTwosComponent, CircuitComponent);
  CircuitTwosComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    // output line
    this._snap.line(0.8*w, 0.65*h, w, 0.65*h);
    this._snap.line(0.8*w, 0.35*h, w, 0.35*h);
    // the component "body"
    this._snap.circle(0.5*w,0.5*h,0.3*w);

    this._positionInputHandles(true);
    this._outputElements[0].css({"top": 0.35*h - 0.5*this._outputElements[0].outerHeight(),
                                  "right": -0.5*this._outputElements[0].outerWidth()});
    this._outputElements[1].css({"top": 0.65*h - 0.5*this._outputElements[0].outerHeight(),
                                  "right": -0.5*this._outputElements[0].outerWidth()});
  };
  CircuitTwosComponent.prototype._xorCalculateOutput = CircuitXorComponent.prototype.calculateOutput;
  CircuitTwosComponent.prototype.calculateOutput = function(inputs) {
    var in1 = inputs[0],
        in2 = inputs[1];
    var outputs = [!in1,!in2];
    outputs[0] = CircuitXorComponent.prototype.calculateOutput(outputs[0],1);
    outputs[1] = CircuitXorComponent.prototype.calculateOutput(outputs[0],outputs[1]);
    return outputs;
  };

  var CircuitEqvComponent = function(circuit, options) {
    this._componentName = "eqv";
    this.init(circuit, options);
  };
  Utils.extend(CircuitEqvComponent, CircuitComponent);
  CircuitEqvComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
      h = this.element.outerHeight();
    this._snap.line(0.75*w + 11, 0.5*h, w, 0.5*h);
    this._snap.path("M" + 0.25*w + " " + 0.1*h + // move to x y)
                    " Q" + 0.6*w + " " + 0.15*h + " " + 0.75*w + " " + 0.5*h +
                    " Q" + 0.6*w + " " + 0.85*h + " " + 0.25*w + " " + 0.9*h +
                    " Q" + 0.35*w + " " + 0.5*h + " " + 0.25*w + " " + 0.1*h);
    this._snap.path("M" + 0.2*w + " " + 0.1*h +
                    " Q" + 0.3*w + " " + 0.5*h + " " + 0.2*w + " " + 0.9*h);
    this._snap.circle(0.75*w + 6, 0.5*h, 4);
    var i = this._inputCount,
      inputspacing = 0.8*h / (i + 1);
    for (; i--;) {
      // magic number 3; should calculate the intersection of the bezier and the line
      this._snap.line(0, 0.1 * h + inputspacing * (i + 1), 0.2 * w + 3, 0.1 * h + inputspacing * (i + 1));
    }

    this._positionHandles(false);
  };
  CircuitEqvComponent.prototype._xorCalculateOutput = CircuitXorComponent.prototype.calculateOutput;
  CircuitEqvComponent.prototype.calculateOutput = function(input) {
    var xorResult = this._xorCalculateOutput(input);
    return [!xorResult[0]];
  };
  // component for input for the circuit
  var CircuitInputComponent = function(circuit, options) {
    this._componentName = options.componentName || "INPUT";
    options.classNames = (options.classNames || "") + " lechef-input-component";
    this.init(circuit, options);
  };
  Utils.extend(CircuitInputComponent, CircuitComponent);
  CircuitInputComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    this._snap.line(0.6*w + 2, 0.5*h, w, 0.5*h);
    this._snap.rect(2, 0.2*h, 0.6*w, 0.6*h);
    this._positionHandles(false);
  };
  CircuitInputComponent.prototype.simulateOutput = function(inputVal, comp) {
    this._outputElements[0].addClass(CIRCUIT_CONSTANTS.VALCLASS[inputVal]);
    this._setPathValues(inputVal);

    if (this._outputs[0] && this._outputs[0].length > 0) {
      for (var j=0; j < this._outputs[0].length; j++) {
        this._outputs[0][j].simulateOutput(inputVal, this);
      }
    }

  };
  CircuitInputComponent.prototype.state = function() {
    return $.extend({name: "input", componentName: this._componentName}, this.options,
          { left: this.element.css("left"), top: this.element.css("top")});
  };

  // component for output of the circuit
  var CircuitOutputComponent = function(circuit, options) {
    this._componentName = options.componentName || "OUTPUT";
    options.classNames = (options.classNames || "") + " lechef-output-component";
    this.init(circuit, options);
  };
  Utils.extend(CircuitOutputComponent, CircuitComponent);
  CircuitOutputComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    this._snap.line(0, 0.5*h, 0.4*w - 5, 0.5*h);
    this._snap.rect(0.4*w - 5, 0.2*h, 0.6*w, 0.6*h);
    this._positionHandles(false);
  };
  CircuitOutputComponent.prototype.simulateOutput = function(input, comp) {
    this._inputElements[0].addClass(CIRCUIT_CONSTANTS.VALCLASS[input]);
    if ($.isFunction(this._outputListener)) {
      this._outputListener(this._componentName, input);
    }
  };
  CircuitOutputComponent.prototype.setOutputListener = function(func) {
    this._outputListener = func;
  };
  CircuitOutputComponent.prototype.state = function() {
    return $.extend({name: "output", componentName: this._componentName, left: this.element.css("left"),
      top: this.element.css("top")}, this.options);
  };

  var CircuitHalfAdderComponent = function(circuit, options) {
    var opts = $.extend({outputCount: 2}, options);
    this._componentName = "halfadder";
    this.init(circuit, opts);
    //this.element.find(".lechef-label").html("&frac13;");
  };
  Utils.extend(CircuitHalfAdderComponent, CircuitComponent);
  CircuitHalfAdderComponent.prototype.drawComponent = function() {
    var w = this.element.outerWidth(),
        h = this.element.outerHeight();
    // output line
    this._snap.line(0.7*w, 0.5*h, w, 0.5*h);
    // output line downward
    this._snap.line(0.45*w, 0.8*h, 0.45*w, h);
    // the component "body"
    this._snap.rect(0.2*w, 0.2*h, 0.5*w, 0.6*h);

    this._positionInputHandles(true);
    this._outputElements[0].css({"top": 0.5*h - 0.5*this._outputElements[0].outerHeight(),
                                  "right": -0.5*this._outputElements[0].outerWidth()});
    this._outputElements[1].css({"bottom": -0.5*this._outputElements[1].outerHeight(),
                                  "left": 0.45*w - 0.5*this._outputElements[1].outerWidth()});
  };
  CircuitHalfAdderComponent.prototype.calculateOutput = function(inputs) {
    var in1 = inputs[0],
        in2 = inputs[1],
        res0 = (in1 || in2) && !(in1 && in2),
        res1 = in1 && in2;
    return [res0, res1];
  };


  var CircuitHalfSubstractorComponent = function(circuit, options) {
    var opts = $.extend({outputCount: 2}, options);
    this._componentName = "halfsubstractor";
    this.init(circuit, opts);
    this.element.find(".lechef-label").html("-&frac12;")
  };
  Utils.extend(CircuitHalfSubstractorComponent, CircuitHalfAdderComponent);
  CircuitHalfSubstractorComponent.prototype.calculateOutput = function(inputs) {
    var in1 = inputs[0],
      in2 = inputs[1],
      res0 = (in1 || in2) && !(in1 && in2),
      res1 = !in1 && in2;
    return [res0, res1];
  };

  var LogicCircuit = function(options) {
    var opts = $.extend({autoresize: true}, options);
    this.element = opts.element || $("<div />");
    if (!opts.element) {
      this.element.appendTo(document.body);
    }
    if (opts.autoresize) {
      this.element.on("lechef-circuit-changed", function() {
        this._resize();
      }.bind(this));
    }
    var svgId = "LC" + new Date().getTime();
    this.element.append("<svg id='" + svgId + "'></svg>");
    this._snap = new Snap("#" + svgId);
    this.element.addClass("lechef-circuit");
    this._components = [];
  };
  LogicCircuit.COMPONENT_TYPES = {
    CircuitAndComponent: CircuitAndComponent,
    CircuitNandComponent: CircuitNandComponent,
    CircuitNotComponent: CircuitNotComponent,
    CircuitOrComponent: CircuitOrComponent,
    CircuitNorComponent: CircuitNorComponent,
    CircuitXorComponent: CircuitXorComponent,
    CircuitTwosComponent: CircuitTwosComponent,
    CircuitAddComponent: CircuitAddComponent,
    CircuitEqvComponent: CircuitEqvComponent,
    CircuitInputComponent: CircuitInputComponent,
    CircuitOutputComponent: CircuitOutputComponent,
    CircuitHalfAdderComponent: CircuitHalfAdderComponent,
    CircuitHalfSubstractorComponent: CircuitHalfSubstractorComponent
  };

  var logicproto = LogicCircuit.prototype;
  logicproto._resize = function() {
    var e = this.element,
        mx = e.width(),
        my = e.height();
    e.find(".lechef-component").each(function(index, item) {
      var $item = $(item);
      var pos = $item.position();
      mx = Math.max(mx, pos.left + $item.width() + 20);
      my = Math.max(my, pos.top + $item.height());
    });
    e.css({height: my, width: mx});

  };
  logicproto.andComponent = function(options) {
    var comp = new CircuitAndComponent(this, options);
    this._components.push(comp);
    // console.log("ye chal raha hia",this._components)
    return comp;
  };
  logicproto.nandComponent = function(options) {
    var comp = new CircuitNandComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.notComponent = function(options) {
    var comp = new CircuitNotComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.orComponent = function(options) {
    var comp = new CircuitOrComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.norComponent = function(options) {
    var comp = new CircuitNorComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.xorComponent = function(options) {
    var comp = new CircuitXorComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.twosComponent = function(options) {
    var comp = new CircuitTwosComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.AddComponent = function(options) {
    var comp = new CircuitAddComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.eqvComponent = function(options) {
    var comp = new CircuitEqvComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.inputComponent = function(label, options) {
    var opts = $.extend({inputCount: 0, componentName: label}, options);
    var comp = new CircuitInputComponent(this, opts);
    if (!this._inputs) {
      this._inputs = {};
    }
    this._components.push(comp);
    this._inputs[label] = comp;
    return comp;
  };
  logicproto.outputComponent = function(label, options) {
    var opts = $.extend({outputCount: 0, inputCount: 1, componentName: label}, options);
    var comp = new CircuitOutputComponent(this, opts);
    if (!this._outputs) { this._outputs = {}; }
    this._components.push(comp);
    this._outputs[label] = comp;
    return comp;
  };
  logicproto.halfAdderComponent = function(options) {
    var comp = new CircuitHalfAdderComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.halfSubstractorComponent = function(options) {
    var comp = new CircuitHalfSubstractorComponent(this, options);
    this._components.push(comp);
    return comp;
  };
  logicproto.removeComponent = function(comp) {
     console.log(comp)
    // var index = this._components.indexOf(comp);
    // var index = this._components.findIndex(function(component) { 
    //   return component._componentName === comp;
    // });
    var lastIndex = -1;
    for (var i = this._components.length - 1; i >= 0; i--) {
      if (this._components[i]._componentName === comp) {
        lastIndex = i;
        break; // Stop the loop once the last occurrence is found
      }
    }   
    console.log("Last Index",lastIndex)
    if (lastIndex !== -1) {
      // console.log("yaha aa gye")
      // comp.remove();
      this._components[lastIndex].remove();
      this._components.splice(lastIndex, 1);
      //console.log("After rem:",this._components);
    }
  };
  logicproto.components = function() {
    return this._components.slice(0);
  };
  logicproto.resetOutput = function() {
    var comps = this._components;
    for (var i = comps.length; i--; ) {
      delete comps[i]._inputSimulation;
      delete comps[i]._inputSimulationCompsLeft;
    }
  };
  logicproto.simulateOutput = function(input, showFeedback, callback) {
    this.resetOutput();
    if (showFeedback) {
      this.element.addClass("lechef-showfeedback");
    }
    var result = {},
        outs = this._outputs,
        outputsMissing = 0,
        called = false;
    console.log(outs);
    var allDone = function allDone() {
      if (!called) {
        called = true;
        if ($.isFunction(callback)) {
          setTimeout(function() {
            callback(result);
          }, 0);
        }
      }
    }.bind(this);
    for (var output in outs) {
      var valid = outs[output].validateInputs();
      if (valid) {
        outs[output].setOutputListener(function (key, val) {
          result[key] = val;
          outputsMissing--;
          if (outputsMissing === 0) {
            setTimeout(allDone, 0);
          }
        });
        outputsMissing++;
      }
    }
    if (outputsMissing > 0) {
      for (var inp in this._inputs) {
        this._inputs[inp].simulateOutput(input[inp], this._inputs[inp]);
      }
      setTimeout(allDone, 0);
    } else {
      setTimeout(allDone, 0);
    }
  };
  logicproto.clearFeedback = function() {
    var fbClasses = [CIRCUIT_CONSTANTS.VALCLASS[false], CIRCUIT_CONSTANTS.VALCLASS[true]];
    this.element.find("." + fbClasses.join(",.")).removeClass(fbClasses.join(' '));
    this.element.removeClass("lechef-showfeedback");
    // the above won't work for the SVG elements, so we'll go through the objects
    for (var i = this._components.length; i--; ) {
      var c = this._components[i];
      for (var j = c._outputpaths.length; j--; ) {
        for (var k = c._outputpaths[j].length; k--; )
        c._outputpaths[j][k].clearValue();
      }
    }
  };
  logicproto.state = function(newState) {
    var state, c, i, j, newC, comps;
    if (typeof newState === "undefined") { // return state
      state = {components: [], connections: []};
      for (i = 0; i < this._components.length; i++) {
        c = this._components[i];
        state.components.push(c.state());
      }
      for (i = 0; i < this._components.length; i++) {
        c = this._components[i];
        for (j = 0; j < c._inputs.length; j++) {
          if (c._inputpaths[j]) {
            state.connections.push({to: i, from: this._components.indexOf(c._inputs[j]),
                                   topos: j, frompos: c._inputpaths[j]._outOfPos});
          }
        }
      }
      return state;
    } else { // set current state
      comps = this.components();
      for (i = comps.length; i--; ) {
        this.removeComponent(comps[i]);
      }
      for (i = 0; i < newState.components.length; i++) {
        c = newState.components[i];
        if (c.name === "input") {
          newC = this.inputComponent(c.componentName, c);
        } else if (c.name === "output") {
          newC = this.outputComponent(c.componentName, c);
        } else {
          newC = this[c.name + "Component"](c);
        }
      }
      for (i = 0; i < newState.connections.length; i++) {
        c = newState.connections[i];
        this._components[c.to].inputComponent(c.topos, c.frompos, this._components[c.from]);
      }
    }
  };

  window.LogicCircuit = LogicCircuit;


  var TRANSLATIONS = {
    "en": {
      SUBMIT: "Submit",
      CLOSE: "Close",
      YOUR_CIRCUIT: "Your",
      EXPECTED: "Expected",
      INPUT: "Input",
      OUTPUT_COMPARISON: "Output comparison",
      FEEDBACK: "Feedback",
      REMOVE_CONFIRM: "Are you sure you want to remove this component?"
    },
    "fi": {
      SUBMIT: "Lähetä",
      CLOSE: "Sulje",
      YOUR_CIRCUIT: "Sinun",
      EXPECTED: "Odotettu",
      INPUT: "Syöte",
      OUTPUT_COMPARISON: "Ulostulon vertailu",
      FEEDBACK: "Palaute",
      REMOVE_CONFIRM: "Haluatko varmasti poistaa tämän komponentin?"
    }
  };
  LogicCircuit.TRANSLATIONS = TRANSLATIONS;
  LogicCircuit.getLocalizedString = function(lang, strkey) {
    if (!TRANSLATIONS[lang] ||!TRANSLATIONS[lang][strkey]) {
      return strkey;
    }
    return TRANSLATIONS[lang][strkey];
  };

}());
/* global $ Snap */
(function() {
  "use strict";
  var CircuitEditor = function (options) {
    this.options = $.extend({useImages: false}, options);
    this.element = this.options.element;
    this.lang = this.options.lang || "en";
    this.circuit = new LogicCircuit(options);
    this.createToolbar();
    this.initToolbar();
  };
  var editorproto = CircuitEditor.prototype;
  editorproto.createToolbar = function () {
    var comps = this.options.components || ["and", "nand", "not", "or", "nor", "xor", "eqv"],
      html = "";
    for (var i = 0; i < comps.length; i++) {
      var c = comps[i];
      html += '<button class="add' + c + '" title="' + c + '">' +
        (this.options.useImages ? '<img src="images/' + c + '.svg" />' : c.toUpperCase()) +
        '</button>';
    }
    var $buttonPanel = this.options.buttonPanelElement || this.element.find(".lechef-buttonpanel");
    $buttonPanel.html(html);
    this.buttonPanel = $buttonPanel;
  };
  editorproto.initToolbar = function () {
    const self = this;

    var $buttonPanel = this.buttonPanel,
        compOptions = {removeAllowed: true};
    $(".addnot", $buttonPanel).click(function () {
      var comp = this.circuit.notComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addand", $buttonPanel).click(function () {
      var comp = this.circuit.andComponent(compOptions);
      // console.log(this)
      // console.log(this.circuit._components)
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addnand", $buttonPanel).click(function () {
      var comp = this.circuit.nandComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addor", $buttonPanel).click(function () {
      var comp = this.circuit.orComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addnor", $buttonPanel).click(function () {
      var comp = this.circuit.norComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addxor", $buttonPanel).click(function () {
      var comp = this.circuit.xorComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addtwos", $buttonPanel).click(function () {
      var comp = this.circuit.twosComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addadd", $buttonPanel).click(function () {
      var comp = this.circuit.AddComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addeqv", $buttonPanel).click(function () {
      var comp = this.circuit.eqvComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addha", $buttonPanel).click(function () {
      var comp = this.circuit.halfAdderComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
    $(".addhs", $buttonPanel).click(function () {
      var comp = this.circuit.halfSubstractorComponent(compOptions);
      this.element.trigger("lechef-circuit-changed");
      this.setInteractive(comp);
    }.bind(this));
  };
  editorproto.setInteractive = function (comp) {
    var x, y,
        editor = this;
    if (comp.options.removeAllowed) {
      comp.element.dblclick(function() {
        var remove = true;
        if (editor.options.removeConfirm) {
          remove = confirm(LogicCircuit.getLocalizedString(editor.lang, "REMOVE_CONFIRM"));
        }
        if (remove) {
          editor.circuit.removeComponent(comp);
        }
      });
    }
    comp.element.find('.lechef-output').draggable({
      revert: true,
      helper: "clone",
      start: function (evt, ui) {
        var pos = comp.element.position(),
            helper = ui.helper,
            helperPos = helper.position();
        x = pos.left + helperPos.left + helper.outerWidth();
        y = pos.top + helperPos.top + helper.outerHeight() / 2.0;
        editor.path = editor.circuit._snap.path("M" + x + " " + y + " Q" + x + " " + y + " " + x + " " + y);
        editor.path.addClass("lechef-connector lechef-unconnected");
        editor.circuit.clearFeedback();
      },
      drag: function (evt, ui) {
        var pos = comp.element.position(),
            helper = ui.helper,
            helperPos = helper.position();
        var newX = pos.left + helperPos.left + helper.outerWidth() / 2.0,
          newY = pos.top + helperPos.top + helper.outerHeight() / 2.0;
        editor.path.attr("path", "M" + x + " " + y + // move to the starting point
          " C" + (x + newX) / 2.0 + " " + y + // cubic bezier, first control point
          " " + (x + newX) / 2.0 + " " + newY + // cubic bezier, second control point
          " " + newX + " " + newY); // cubix bezier, end point
      },
      stop: function (evt, ui) {
        if (editor.selected) {
          editor.selected.inputComponent(editor.pos, ui.helper.data("pos"), comp, {connectorRemoveAllowed: true});
        }
        editor.path.remove();
        editor.path = null;
        editor.selected = null;
        editor.element.trigger("lechef-circuit-changed");
      }.bind(this)});
    comp.element.find(".lechef-input").droppable({
      accept: ".lechef-output",
      drop: function (evt, ui) {
        if (editor.path) {
          editor.pos = $(this).data("pos");
          editor.selected = comp;
          editor.element.trigger("lechef-circuit-changed");
        }
      },
      over: function (evt, ui) {
        if (editor.path) {
          editor.path.removeClass("lechef-unconnected");
        }
      },
      out: function (evt, ui) {
        if (editor.path) {
          editor.path.addClass("lechef-unconnected");
        }
      }
    });
  };
  editorproto.state = function (newState) {
    if (typeof newState === "undefined") {
      return this.circuit.state();
    } else {
      this.circuit.state(newState);
      var comps = this.circuit.components();
      for (var i = comps.length; i--;) {
        this.setInteractive(comps[i]);
      }
    }
  };

  window.CircuitEditor = CircuitEditor;
}());
/* global $ Snap */
(function() {
  "use strict";

  var CircuitExercise = function (options) {
    this.options = $.extend({components: ["and", "not", "or"],
      template: '<div class="lechef-buttonpanel" />' +
                '<div class="lechef-circuit" />',
      addSubmit: true}, options);
    this.lang = this.options.lang || "en";
    this.element = this.options.element;
    this._init();
  };
  var exerproto = CircuitExercise.prototype;
  exerproto._init = function() {
    // console.log("yaha aa raha hai")
    this.element.html(this.options.template);
    this.editor = new CircuitEditor($.extend({}, this.options, {element: this.element.find(".lechef-circuit"),
      buttonPanelElement: this.element.find(".lechef-buttonpanel")}));
    if (this.options.addSubmit) {
      this.addSubmitToToolbar();
    }

    this.initInputs();
    this.initOutputs();
  };
  exerproto.addSubmitToToolbar = function () {
    var $buttonPanel = this.options.buttonPanelElement || this.element.find(".lechef-buttonpanel");
    $buttonPanel.prepend('<button class="submit">' + LogicCircuit.getLocalizedString(this.lang, "SUBMIT") + '</button>');
    this.element.find(".submit").click(function () {
      this.grade(function(fb) {
        this.editor.circuit.clearFeedback();
        new CircuitExerciseFeedback(this.options, fb);
      }.bind(this));
    }.bind(this));
  };
  exerproto.initInputs = function () {
    var input = this.options.input,
      w = this.editor.circuit.element.outerWidth(),
      h = this.editor.circuit.element.outerHeight();
    var inputSpacing = 0.8 * h / (input.length + 1);
    for (var i = 0; i < input.length; i++) {
      var inp = this.editor.circuit.inputComponent(input[i]);
      this.editor.setInteractive(inp);
      inp.element.css({top: i*70 + 10,
        left: Math.round(0.1 * w) });
    }
  };
  exerproto.initOutputs = function () {
    var output = this.options.output,
      w = this.editor.circuit.element.outerWidth(),
      h = this.editor.circuit.element.outerHeight();
    var outputSpacing = 0.8 * h / (output.length + 1);
    for (var i = 0; i < output.length; i++) {
      var out = this.editor.circuit.outputComponent(output[i]);
      this.editor.setInteractive(out);
      out.element.css({top: i*70 + 10,
        left: Math.min(600, Math.round(0.9 * w)) });
    }
  };
  exerproto.reset = function() {
    // console.log(this._init)
    this._init();
  };
  exerproto.grade = function (callback) {
    var checks = $.extend([], this.options.grading),
      feedback = {checks: [], success: true},
      correct;
    var doCheck = function(c) {
      this.editor.circuit.clearFeedback();
      this.editor.circuit.simulateOutput(c.input, false, function(res) {
        if (this.options.output.length === 1) {
          correct = (c.output === res[this.options.output[0]]);
        }
        feedback.success = feedback.success && correct;
        var checkFb = { input: $.extend({}, c.input), output: $.extend({}, res),
          expected: c.output, correct: correct};
        feedback.checks.push(checkFb);
        checks.splice(checks.indexOf(c), 1);
        if (checks.length > 0) {
          doCheck(checks[0]);
        } else {
          this.editor.circuit.clearFeedback();
          feedback.circuit = this.editor.circuit.state();
          callback(feedback);
        }
      }.bind(this));
    }.bind(this);
    if (checks && checks.length > 0) {
      doCheck(checks[0]);
    }
  };

  var CircuitExerciseFeedback = function (exeropts, feedback, options) {
    this.options = $.extend({}, options);
    this.exeropts = exeropts;
    this.feedback = feedback;
    this.lang = this.options.lang || exeropts.lang || "en";
    if (!this.options.element) {
      this.element = $("<div></div>");
      this.element.appendTo(document.body);
    } else {
      this.element = $(this.options.element);
    }
    this.element.addClass("lechef-feedback");
    this.element.html("<div class='lechef-input-output'></div>" +
                    "<div class='lechef-circuit'></div>");
    this.initFeedback();
    this.initCircuit();
  };
  CircuitExerciseFeedback.prototype.initFeedback = function () {
    var outputKey = this.exeropts.output;
    var fbHTML = "<h2>" + LogicCircuit.getLocalizedString(this.lang, "FEEDBACK") +
                 "</h2><button class='lechef-close'>" +
                 LogicCircuit.getLocalizedString(this.lang, "CLOSE") + "</button><table><thead><tr>";
    fbHTML += "<th class='lechef-top' colspan='" + this.exeropts.input.length + "'>" +
                    LogicCircuit.getLocalizedString(this.lang, "INPUT") + "</th><th class='empty'></th>" +
                    "<th colspan='2'>" + LogicCircuit.getLocalizedString(this.lang, "OUTPUT_COMPARISON") +
                    "</th></tr><tr>";
    fbHTML += "<th>" + this.exeropts.input.join('</th><th>');
    fbHTML += "</th><th class='empty'></th><th>" + LogicCircuit.getLocalizedString(this.lang, "YOUR_CIRCUIT") +
                    " " + outputKey + '</th>';
    fbHTML += "<th>" + LogicCircuit.getLocalizedString(this.lang, "EXPECTED") + " " + outputKey +
                    "</th></tr></thead><tbody>";

    for (var i = 0; i < this.feedback.checks.length; i++) {
      var c = this.feedback.checks[i];
      fbHTML += "<tr data-check='" + i + "'";
      fbHTML += " class='" + (c.correct ? "lechef-correct" : "lechef-incorrect") + "'>";
      for (var j = 0; j < this.exeropts.input.length; j++) {
        fbHTML += "<td>" + (c.input[this.exeropts.input[j]]?"1":"0") + "</td>";
      }
      var outVal = c.output[outputKey];
      if (outVal === null) {
        outVal = "";
      } else {
        outVal = (outVal?"1":"0");
      }
      fbHTML += "<td class='empty'></td>";
      fbHTML += "<td class='lechef-output-table'>" + outVal + "</td>";
      fbHTML += "<td class='lechef-output-table'>" + (c.expected?"1":"0") + "</td>";
      fbHTML += "</tr>";
    }
    fbHTML += "</tbody></table>";

    var self = this;
    this.element.find('.lechef-input-output').html(fbHTML)
      .find("tbody tr").click(function() {
        self.circuit.clearFeedback();
        self.circuit.simulateOutput(self.feedback.checks[$(this).data("check")].input, true);
        $(this).parent().find(".lechef-active").removeClass("lechef-active");
        $(this).addClass("lechef-active");
      });
    this.element.find(".lechef-close").click(function() {
      if (self.options.element) {
        self.element.html("");
      } else {
        self.element.remove();
      }
    });
  };
  CircuitExerciseFeedback.prototype.initCircuit = function () {
    this.circuit = new LogicCircuit({element: this.element.find(".lechef-circuit")});
    this.circuit.state(this.feedback.circuit);
  };


  var CircuitSimulationExercise = function (circuit, options) {
    this.circuit = circuit;
    this.circuit.element.addClass("lechef-showfeedback");
    this.options = $.extend({}, options);
    this.initInputs();
    this.initToggles();
  };
  CircuitSimulationExercise.prototype.initInputs = function () {
    var inputValues = this.options.input;
    var inputComponents = this.circuit._inputs;
    for (var key in inputComponents) {
      if (inputComponents.hasOwnProperty(key)) {
        inputComponents[key].element.find(".lechef-output").addClass(CIRCUIT_CONSTANTS.VALCLASS[inputValues[key]]);
      }
    }
  };
  CircuitSimulationExercise.prototype.initToggles = function () {
    var toggles = this.circuit.element.find(".lechef-output, .lechef-input")
      .not(".lechef-value-true, .lechef-value-false")
      .addClass(CIRCUIT_CONSTANTS.VALCLASS.UNKNOWN)
      .addClass("lechef-value-interactive");
    var circuit = this.circuit;
    toggles.click(function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var $this = $(this);
      if ($this.hasClass(CIRCUIT_CONSTANTS.VALCLASS.UNKNOWN)) {
        $this.removeClass(CIRCUIT_CONSTANTS.VALCLASS.UNKNOWN)
          .addClass(CIRCUIT_CONSTANTS.VALCLASS[false]);
      } else {
        $this.toggleClass(CIRCUIT_CONSTANTS.VALCLASS[false])
          .toggleClass(CIRCUIT_CONSTANTS.VALCLASS[true]);
      }
      circuit.element.trigger("lechef-circuit-changed");
    });
  };
  CircuitSimulationExercise.prototype.reset = function() {
    this.circuit.element.find(".lechef-value-interactive.lechef-value-true, .lechef-value-interactive.lechef-value-false")
                      .removeClass("lechef-value-true lechef-value-false")
                      .addClass("lechef-value-unknown");
  };

  CircuitSimulationExercise.prototype.grade = function (callback) {
    var outputValue = function (comp) {
        if (comp.element.find(".lechef-output." + CIRCUIT_CONSTANTS.VALCLASS[true]).size() > 0) {
          return true;
        } else if (comp.element.find(".lechef-output." + CIRCUIT_CONSTANTS.VALCLASS[false]).size() > 0) {
          return false;
        } else {
          return null;
        }
      },
      inputValue = function (comp, pos) {
        if (comp.element.find(".lechef-input." + CIRCUIT_CONSTANTS.VALCLASS[true] +
          "[data-pos=" + pos + "]").size() > 0) {
          return true;
        } else if (comp.element.find(".lechef-input." + CIRCUIT_CONSTANTS.VALCLASS[false] +
          "[data-pos=" + pos + "]").size() > 0) {
          return false;
        } else {
          return null;
        }
      };
    var modelcircuit = new LogicCircuit({});
    modelcircuit.state(this.circuit.state());
    modelcircuit.simulateOutput(this.options.input, true, function() {
      var modelComps = modelcircuit._components,
        stdComps = this.circuit._components,
        mc, sc, fb, corr, state, val, success = true,
        feedback = [],
        states = [];
      for (var i = 0, l = stdComps.length; i < l; i++) {
        mc = modelComps[i];
        sc = stdComps[i];
        if (!(sc instanceof LogicCircuit.COMPONENT_TYPES.CircuitInputComponent)) {
          fb = {input: []};
          feedback.push(fb);
          state = {input: []};
          states.push(state);
          if (!(sc instanceof LogicCircuit.COMPONENT_TYPES.CircuitOutputComponent)) {
            val = outputValue(sc);
            corr = (val === outputValue(mc));
            success = success && corr;
            fb.output = corr;
            state.output = val;
          }
          for (var j = 0; j < sc._inputCount; j++) {
            val = inputValue(sc, j);
            corr = (val === inputValue(mc, j));
            success = success && corr;
            fb.input.push(corr);
            state.input.push(val);
          }
        } else {
          feedback.push(null);
          states.push(null);
        }
      }
      modelcircuit.element.remove();
      callback({feedback: feedback, states: states, success: success, circuit: this.circuit.state()});
    }.bind(this));
  };

  var CircuitSimulationFeedback = function (exeropts, feedback, options) {
    this.options = $.extend({}, options);
    this.exeropts = exeropts;
    this.feedback = feedback;
    this.lang = this.options.lang || exeropts.lang || "en";
    if (!this.options.element) {
      this.element = $("<div></div>");
      this.element.appendTo(document.body);
    } else {
      this.element = $(this.options.element);
    }
    this.element.addClass("lechef-feedback");
    this.element.html("<button class='lechef-close'>" + LogicCircuit.getLocalizedString(this.lang, "CLOSE") +
                      "</button><div class='lechef-circuit'></div>");
    this.initCircuit();
    this.initFeedback();

    var self = this;
    this.element.find(".lechef-close").click(function () {
      if (!self.options.element) {
        this.element.remove();
      } else {
        this.element.html("");
      }
    }.bind(this));
  };
  CircuitSimulationFeedback.prototype.initCircuit = CircuitExerciseFeedback.prototype.initCircuit;
  CircuitSimulationFeedback.prototype.initFeedback = function () {
    var comps = this.circuit._components,
      feedback = this.feedback.feedback,
      states = this.feedback.states,
      c, state, fb;
    var outputFeedback = function (comp, compFb, compState) {
      var e = comp.element.find(".lechef-output");
      e.addClass(CIRCUIT_CONSTANTS.VALCLASS[compState.output])
        .addClass(CIRCUIT_CONSTANTS.FEEDBACKCLASS[compFb.output])
        .addClass("lechef-value-interactive");
    };
    var inputFeedback = function (comp, pos, compFb, compState) {
      var e = comp._inputElements[pos];
      e.addClass(CIRCUIT_CONSTANTS.VALCLASS[compState.input[pos]])
        .addClass(CIRCUIT_CONSTANTS.FEEDBACKCLASS[compFb.input[pos]])
        .addClass("lechef-value-interactive");
    };
    for (var i = 0, l = comps.length; i < l; i++) {
      c = comps[i];
      if (!(c instanceof LogicCircuit.COMPONENT_TYPES.CircuitInputComponent)) {
        fb = feedback[i];
        state = states[i];
        if (!(c instanceof LogicCircuit.COMPONENT_TYPES.CircuitOutputComponent)) {
          outputFeedback(c, fb, state);
        }
        for (var j = c._inputCount; j--;) {
          inputFeedback(c, j, fb, state);
        }
      } else { // add the value label to the input
        c.element.find(".lechef-output").addClass(CIRCUIT_CONSTANTS.VALCLASS[this.exeropts.input[c._componentName]]);
      }
    }
  };

  window.CircuitExercise = CircuitExercise;
  window.CircuitExerciseFeedback = CircuitExerciseFeedback;
  window.CircuitSimulationExercise = CircuitSimulationExercise;
  window.CircuitSimulationFeedback = CircuitSimulationFeedback;
}());