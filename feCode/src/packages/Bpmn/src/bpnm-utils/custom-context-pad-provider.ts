import { hasPrimaryModifier } from 'diagram-js/lib/util/Mouse'

import { is } from 'bpmn-js/lib/util/ModelUtil'

import { isExpanded, isEventSubProcess } from 'bpmn-js/lib/util/DiUtil'

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

import { getChildLanes } from 'bpmn-js/lib/features/modeling/util/LaneUtil'
function ContextPadProvider(
  config,
  injector,
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  popupMenu,
  canvas,
  rules,
  translate
) {
  config = config || {}

  contextPad.registerProvider(this)

  this._contextPad = contextPad

  this._modeling = modeling

  this._elementFactory = elementFactory
  this._connect = connect
  this._create = create
  this._popupMenu = popupMenu
  this._canvas = canvas
  this._rules = rules
  this._translate = translate

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false)
  }

  eventBus.on('create.end', 250, function (event) {
    const context = event.context,
      shape = context.shape

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return
    }

    const entries = contextPad.getEntries(shape)

    if (entries.replace) {
      entries.replace.action.click(event, shape)
    }
  })
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
]

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  // console.log(element)
  const contextPad = this._contextPad,
    modeling = this._modeling,
    elementFactory = this._elementFactory,
    connect = this._connect,
    create = this._create,
    popupMenu = this._popupMenu,
    canvas = this._canvas,
    // rules = this._rules,
    autoPlace = this._autoPlace,
    translate = this._translate,
    actions = {}
  const businessObject = element.businessObject
  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {
    if (typeof title !== 'string') {
      options = title
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') })
    }

    function appendStart(event, element) {
      const shape = elementFactory.createShape(Object.assign({ type: type }, options))
      create.start(event, shape, {
        source: element
      })
    }

    const append = autoPlace
      ? function (event, element) {
          const shape = elementFactory.createShape(Object.assign({ type: type }, options))

          autoPlace.append(element, shape)
        }
      : appendStart

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    }
  }

  function removeElement(_e) {
    modeling.removeElements([element])
  }

  function startConnect(event, element) {
    connect.start(event, element)
  }
  function getReplaceMenuPosition(element) {
    const Y_OFFSET = 5

    const diagramContainer = canvas.getContainer(),
      pad = contextPad.getPad(element).html

    const diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect()

    const top = padRect.top - diagramRect.top
    const left = padRect.left - diagramRect.left

    const pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET
    }

    return pos
  }
  function splitLaneHandler(count) {
    return function (event, element) {
      // actual split
      modeling.splitLane(element, count)

      // refresh context pad after split to
      // get rid of split icons
      contextPad.open(element, true)
    }
  }
  if (isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) && isExpanded(businessObject)) {
    const childLanes = getChildLanes(element)

    Object.assign(actions, {
      'lane-insert-above': {
        group: 'lane-insert-above',
        className: 'bpmn-icon-lane-insert-above',
        title: translate('Add Lane above'),
        action: {
          click: function (event, element) {
            modeling.addLane(element, 'top')
          }
        }
      }
    })

    if (childLanes.length < 2) {
      if (element.height >= 120) {
        Object.assign(actions, {
          'lane-divide-two': {
            group: 'lane-divide',
            className: 'bpmn-icon-lane-divide-two',
            title: translate('Divide into two Lanes'),
            action: {
              click: splitLaneHandler(2)
            }
          }
        })
      }

      if (element.height >= 180) {
        Object.assign(actions, {
          'lane-divide-three': {
            group: 'lane-divide',
            className: 'bpmn-icon-lane-divide-three',
            title: translate('Divide into three Lanes'),
            action: {
              click: splitLaneHandler(3)
            }
          }
        })
      }
    }

    Object.assign(actions, {
      'lane-insert-below': {
        group: 'lane-insert-below',
        className: 'bpmn-icon-lane-insert-below',
        title: translate('Add Lane below'),
        action: {
          click: function (event, element) {
            modeling.addLane(element, 'bottom')
          }
        }
      }
    })
  }
  if (element.type === 'bpmn:SequenceFlow') {
    Object.assign(actions, {
      // 'append.end-event': appendAction(
      //   'bpmn:EndEvent',
      //   'bpmn-icon-end-event-none',
      //   translate('Append EndEvent'),
      // ),
      // 'append.gateway': appendAction(
      //   'bpmn:ExclusiveGateway',
      //   'bpmn-icon-gateway-none',
      //   translate('Append Gateway'),
      // ),
      // 'append.append-task': appendAction(
      //   'bpmn:UserTask',
      //   'bpmn-icon-user-task',
      //   translate('Append Task'),
      // ),
      // 'append.intermediate-event': appendAction(
      //   'bpmn:IntermediateThrowEvent',
      //   'bpmn-icon-intermediate-event-none',
      //   translate('Append Intermediate/Boundary Event'),
      // ),
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
      // connect: {
      //   group: 'connect',
      //   className: 'bpmn-icon-connection-multi',
      //   title: translate('Connect using Association'),
      //   action: {
      //     click: startConnect,
      //     dragstart: startConnect,
      //   },
      // },
    })
  } else {
    Object.assign(actions, {
      'append.end-event': appendAction('bpmn:EndEvent', 'bpmn-icon-end-event-none', translate('Append EndEvent')),
      'append.append-task': appendAction('bpmn:UserTask', 'bpmn-icon-user-task', translate('Append Task')),
      'append.intermediate-event': appendAction(
        'bpmn:IntermediateThrowEvent',
        'bpmn-icon-intermediate-event-none',
        translate('Append Intermediate/Boundary Event')
      ),
      'append.exclusive-gateway': appendAction(
        'bpmn:ExclusiveGateway',
        'bpmn-icon-gateway-xor',
        translate('Append Exclusive Gateway')
      ),
      'append.parallel-gateway': appendAction(
        'bpmn:ParallelGateway',
        'bpmn-icon-gateway-parallel',
        translate('Append Parallel Gateway')
      )
    })

    if (!popupMenu.isEmpty(element, 'bpmn-replace') && element.type.indexOf('Event') > -1) {
      // Replace menu entry
      Object.assign(actions, {
        replace: {
          group: 'edit',
          className: 'bpmn-icon-screw-wrench',
          title: translate('Change type'),
          action: {
            click: function (event, element) {
              const position = Object.assign(getReplaceMenuPosition(element), {
                cursor: { x: event.x, y: event.y }
              })

              popupMenu.open(element, 'bpmn-replace', position)
            }
          }
        }
      })
    }
    Object.assign(actions, {
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      },
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using Association'),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    })
  }

  return actions
}

export default {
  // __depends__: [
  //   DirectEditingModule,
  //   ContextPadModule,
  //   SelectionModule,
  //   ConnectModule,
  //   CreateModule,
  // ],

  __init__: ['contextPadProvider'],
  contextPadProvider: ['type', ContextPadProvider]
}
