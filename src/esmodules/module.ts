const MODULE_ID = 'structured-table-results';

const log = (...args: any): void => {
  try {
    const dev_mode = game.modules?.get('_dev-mode');
    console.log("look here vvv");
    console.log(dev_mode);
    // dev_mode?.api?.setPackageDebugValue(MODULE_ID, true);
    // const isDebugging = game.modules?.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID);
    const isDebugging = true;

    if (isDebugging || true) {
      console.log('DEBUG | ', MODULE_ID, '|', ...args);
    }
  } catch (e) {}
}

// Rendering RollTableConfig
// "target": "es5",
// "strictNullChecks": true,
// "moduleResolution": "Node16",


Hooks.on("init", function() {
    CONFIG.debug.hooks = true;
    log("starting")
});

Hooks.on("renderRollTableConfig", (data: any) => {
    log("RollTableConfig was triggered. This is a debug hook.");
    log(data.form);

    mutateTextInputs(data.form);
});

// "workbox-webpack-plugin": "^7.1.0"


Hooks.once('devModeReady', ( registerPackageDebugFlag: (moduleId: string) => void) => {
  registerPackageDebugFlag(MODULE_ID);
});

var editor = (inputItem: HTMLInputElement) => { 
  return TextEditor.create({} as TextEditor.Options, inputItem.value);
};

var mutateTextInputs = async(parent: HTMLElement) => {
  let inputs: HTMLInputElement[] = getTextInputs(parent);
    log("getting elements for structured table results");
  
    inputs.forEach((element, index) => {
      let inputField = document.createElement('input') as HTMLInputElement;
      inputField.type = "text";
      inputField.value = element.value;
      let wrapper = document.createElement('div') as HTMLDivElement;
      wrapper.appendChild(inputField);
      let button = document.createElement('button') as HTMLButtonElement;
      button.addEventListener("click", () => editor(inputField));
      button.value = "html";
      wrapper.appendChild(button);
      element.outerHTML = inputField.outerHTML;
    }); 
  };  

var getTextInputs = (parent: HTMLElement): HTMLInputElement[] =>{
  let result: NodeListOf<HTMLInputElement> = parent.querySelectorAll('.result-details>input[name^="results"][name$=".text"]');
  log(result);
  return Array.from(result);
}
