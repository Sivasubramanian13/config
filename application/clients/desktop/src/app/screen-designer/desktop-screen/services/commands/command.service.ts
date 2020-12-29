import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
declare var jQuery: any;

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  feature_id: any;
  project_id: any;
  screenArray: any[] = [];
  screen_id: any;
  @ViewChild('myModal') myModal: ElementRef;

  constructor(
    private location: Location,
    private activateRoute: ActivatedRoute
  ) {
    this.activateRoute.queryParams.subscribe(params => {
      if (params.featureId !== undefined && params.featureId !== null) {
        this.feature_id = params.featureId;
      } else {
        this.feature_id = undefined;
      }
      if (params.projectId !== undefined && params.projectId !== null) {
        this.project_id = params.projectId;
      } else {
        this.project_id = undefined;
      }
      if (params.screenId !== undefined && params.screenId !== null) {
        this.screen_id = params.screenId;
      } else {
        this.screen_id = undefined;
      }
    });
  }

  addSaveCommand(commandName, editor) {
    const $this = this;
    editor.Commands.add(commandName, {
      run: function (e, n) {
        const eventPopupModel = document.getElementById('myModal');
        eventPopupModel.style.display = 'block';
      }
    });

  }

  addCancelCommand(commandName, editor) {
    const previousPageRoute = this.location;
    editor.Commands.add(commandName, {
      run: function (e, n) {
        n.set('active', 0);
        previousPageRoute.back();
        // window.history.go(-1);
      }
    });

  }

  componentSelected($this) {
    $this.editor.on('component:selected', function (component) {
      if (component.attributes.type === 'grid-type') {
        $this.agGridObject.htmlId = component.ccid;
        $this.agGridObject.componentId = component.cid;
        $this.is_grid_present = true;
        console.log('selected grid modals of selectedEntityModel are -----  ', $this.selectedEntityModel);
      }
    });
  }

  toggle($this) {
    // it worked well if we inject the buttons close to the input fields
    $this.editor.on('component:toggled', model => { });
  }

  removeComponent($this) {
    // it called when we remove the component
    $this.editor.on(`component:remove`, function (model) {
      const parentComponent = model.get('components');
      let componentIndex = 0;
      if (model.attributes && model.attributes.name) {
        componentIndex = $this.routeFlows.findIndex(x =>
          x.elementName === model.attributes.name
        );

        if (componentIndex > -1) {
          // remove flows first if present in flows_info
          const flowInfoIndex = $this.screenFlows.findIndex(x =>
            x.elementName === $this.routeFlows[componentIndex].elementName && x.componentId !== '');
          if (flowInfoIndex > -1) {
            $this.screenFlows.splice(flowInfoIndex, 1);
          }
          $this.routeFlows.splice(componentIndex, 1);

        }
        // remove special events
        componentIndex = $this.specialEvents.findIndex(x =>
          x.elementName === model.attributes.name);
        console.log('remove special event parent componentIndex -----  ', componentIndex);
        if (componentIndex > -1) {
          $this.specialEvents.splice(componentIndex, 1);
        }

          // remove link information
          componentIndex = $this.linkArray.findIndex(x =>
            x.elementName === model.attributes.name);
          console.log('remove link info componentIndex -----  ', componentIndex);
          if (componentIndex > -1) {
            $this.linkArray.splice(componentIndex, 1);
          }
      }
      if (parentComponent.length === 0) {
        componentIndex = $this.screenEntityModel.findIndex(x =>
          x.elementName === parentComponent.parent.attributes.name
        );
        if (componentIndex > -1) {
          $this.screenEntityModel.splice(componentIndex, 1);
        }
        componentIndex = $this.screenFlows.findIndex(x =>
          x.elementName === parentComponent.parent.attributes.name && x.componentId !== ''
        );
        if (componentIndex > -1) {
          $this.screenFlows.splice(componentIndex, 1);
        }
        const elementNameIndex = $this.ElementNameArray.findIndex(x => x === parentComponent.parent.attributes.name);
        if (elementNameIndex > -1) {
          $this.ElementNameArray.splice(elementNameIndex, 1);
        }
        $this.saveRemoteStorage();
      } else {
        model.get('components').each(child => {
          componentIndex = $this.screenEntityModel.findIndex(x =>
            x.elementName === child.attributes.name
          );
          if (componentIndex > -1) {
            $this.screenEntityModel.splice(componentIndex, 1);
          }
          componentIndex = $this.screenFlows.findIndex(x =>
            x.elementName === child.attributes.name && x.componentId !== ''
          );
          if (componentIndex > -1) {
            $this.screenFlows.splice(componentIndex, 1);
          }
          const elementNameIndex = $this.ElementNameArray.findIndex(x => x === child.attributes.name);
          if (elementNameIndex > -1) {
            $this.ElementNameArray.splice(elementNameIndex, 1);
          }
          // remove element for special events
          const specialEventIndex = $this.specialEvents.findIndex(x => x.elementName === child.attributes.name);
          if (specialEventIndex > -1) {
            $this.specialEvents.splice(specialEventIndex, 1);
          }

            // remove element for link
            const linkIndex = $this.linkArray.findIndex(x => x.elementName === child.attributes.name);
            if (linkIndex > -1) {
              $this.linkArray.splice(linkIndex, 1);
            }
        });
        $this.saveRemoteStorage();
      }
    });

  }

  updateComponentName($this) {
    // it called when we update the component traits name
    $this.editor.on(`component:update:name`, function (model) {
      if (model._previousAttributes.name === '') {
        $this.ElementNameArray.push(model.attributes.name);
      } else {
        const elementNameIndex = $this.ElementNameArray.findIndex(x => x === model.attributes.name);
        if (elementNameIndex > -1) {
          model.attributes.traits.target.set('name', `${model._previousAttributes.name}`);
          $this.editor.TraitManager.getTraitsViewer().render();
        } else {
          $this.ElementNameArray.push(model.attributes.name);
        }
      }
      const entityIndex = $this.screenEntityModel.findIndex(x =>
        x.elementName === model._previousAttributes.name);
      if (entityIndex > -1) {
        $this.screenEntityModel[entityIndex].elementName = model.attributes.name;
        $this.saveRemoteStorage();
      }
      const flowIndex = $this.screenFlows.findIndex(x =>
        x.elementName === model._previousAttributes.name && x.componentId !== '');
      if (flowIndex > -1) {
        $this.screenFlows[flowIndex].elementName = model.attributes.name;
      }
      // rename element in routeFlows
      const routeIndex = $this.routeFlows.findIndex(x =>
        x.elementName === model._previousAttributes.name);
      if (routeIndex > -1) {
        $this.routeFlows[routeIndex].elementName = model.attributes.name;
      }
      // rename special events
      const specialEventIndex = $this.specialEvents.findIndex(x =>
        x.elementName === model._previousAttributes.name);
      if (specialEventIndex > -1) {
        $this.specialEvents[specialEventIndex].elementName = model.attributes.name;
      }

      // rename link events
      const linkIndex = $this.linkArray.findIndex(x =>
        x.elementName === model._previousAttributes.name);
      if (linkIndex > -1) {
        $this.linkArray[linkIndex].elementName = model.attributes.name;
      }

      $this.saveRemoteStorage();
    });

  }

  updateTraits($this) {
    // select entity if triats values changed then its called
    $this.editor.on(`component:update:${$this.traitsName}`, function (model) {
      $this.selectedEntityModel = model.changed['entity'];
      $this.selectedHtmlElement.htmlId = model.ccid;
      $this.selectedHtmlElement.componentId = model.cid;
      $this.selectedHtmlElement.elementName = model.attributes.name;
    });

    // called when we change value in component lifecycle verbs
    $this.editor.on(`component:update:componentVerb`, function (model) {
      $this.selectedEntityModel = model.changed['componentVerb'];
      $this.componentVerb = $this.componentVerbList.find(x => x.value === model.changed['componentVerb']).key;
    });

    // set whether the screen type as popupmodal or normal one
    $this.editor.on(`component:update:popupmodal`, function (model) {
      if (model.changed['popupmodal']) {
        $this.screenOption = 'popupmodal';
      } else {
        $this.screenOption = 'normal';
      }
    });
    // this.editor.on('change:traits:entity', function (model) {
    // });
  }

  dragAndDrop($this) {
    $this.editor.on('block:drag:stop', function (model) {
      // default
      const allInputModels = model.find('input');
      const allRadioModels = model.find('input[type="radio"i]');
      const allTextAreaModels = model.find('textarea');
      const allOptionModels = model.find('select');
      const allButtonModels = model.find('button');
      const allCheckBoxModels = model.find('input[type="checkbox"i]');
      const allImageBlockModels = model.find('.gpd-image-block');
      const allImageModels = model.find('.gjs-plh-image');
      const allLabelModels = model.find('label');
      const ckeditorspan = model.find('#ckeditorspan');
      const ckeditorTextAreaModels = model.find('span #ckeditortextarea');

      // label
      allLabelModels.forEach(element => {
        // element.set({
        //     attributes: {
        //         class: 'form-control'
        //     }
        // });
        // element.addClass('form-control');
        // const temp = $this.cssGuidelines.find(x => x.tagName === 'input');
        // if (temp) {
        //     element.addClass(temp.className);
        // }
        $this.setElementCSS(element, 'label', null);
      });
      // input
      allInputModels.forEach(element => {
        $this.setElementCSS(element, 'input', null);
        element.attributes.traits.target.set('name', `input_${element.ccid}`);
      });
      // radio
      allRadioModels.forEach(element => {
        if (element) {
          $this.setElementCSS(element, 'radio', 'input');
        }
        element.attributes.traits.target.set('name', `radio_${element.ccid}`);
      });
      // TextArea
      allTextAreaModels.forEach(element => {
        $this.setElementCSS(element, 'textarea', null);
        element.attributes.traits.target.set('name', `textbox_${element.ccid}`);
      });
      // input options
      allOptionModels.forEach(element => {
        $this.setElementCSS(element, 'select', null);
        element.attributes.traits.target.set('name', `select_${element.ccid}`);
      });
      // checkbox
      allCheckBoxModels.forEach(element => {
        $this.setElementCSS(element, 'checkbox', 'input');
        element.attributes.traits.target.set('name', `checkbox_${element.ccid}`);
      });
      // button
      allButtonModels.forEach(element => {
        // set default verbs for button
        $this.buttonVerb = 'click';
        $this.setElementCSS(element, 'button', null);
        element.attributes.traits.target.set('name', `button_${element.ccid}`);
      });
      // image blocks
      allImageBlockModels.forEach(element => {
        element.attributes.traits.target.set('name', `image_${element.ccid}`);
      });
      // images
      allImageModels.forEach(element => {
        element.attributes.traits.target.set('name', `image_${element.ccid}`);
      });
      // ckeditor
      // set dynamic name in ckeditor span
      ckeditorspan.forEach(element => {
        element.attributes.traits.target.set('name', `ckeditor_${element.ccid}`);
      });
      // remove unwanted classes and add the classname if available
      ckeditorTextAreaModels.forEach(element => {
        $this.setElementCSS(element, 'ckeditor', 'textarea');
        element.attributes.traits.target.set('name', `ckeditor_${element.ccid}`);
      });

      // custom blocks and traits
      // get dropped element with its types
      const wrapperType = $this.editor.DomComponents.getWrapper().find('[data-gjs-type="grid-type"]');
      const popupModalType = $this.editor.DomComponents.getWrapper().find('[data-gjs-type="popupModal-type"]');
      const linkType = $this.editor.DomComponents.getWrapper().find('[data-gjs-type="link"]');
      if (wrapperType.length > 0) {
        $this.is_grid_present = true;
        $this.saveRemoteStorage();
        wrapperType.forEach(element => {
          element.attributes.traits.target.set('name', `grid_${element.ccid}`);
        });
      }
      if (popupModalType.length > 0) {
        popupModalType.forEach(element => {
          console.log('ram each popupmodal element are ----  ', element);
          element.attributes.traits.target.set('name', `modal_${element.ccid}`);
        });
      }
      if (linkType.length > 0) {
        linkType.forEach(element => {
          element.attributes.traits.target.set('name', `link_${element.ccid}`);
        });
      }
    });
  }
}
