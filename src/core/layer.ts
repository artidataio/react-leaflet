import { Layer } from 'leaflet'
import { useEffect } from 'react'

import { useLeafletContext, LeafletContextInterface } from './context'
import { UseLeafletElement, LeafletElement } from './element'
import { EventedProps, useLeafletEvents } from './events'

export function useLeafletLayerLifecycle<E extends Layer>(
  element: LeafletElement<E> | null,
  context: LeafletContextInterface | null | undefined,
) {
  useEffect(() => {
    if (element === null || context == null) {
      return
    }

    const container = context.layerContainer ?? context.map
    container.addLayer(element.instance)

    return () => {
      container.removeLayer(element.instance)
    }
  }, [context, element])
}

export function createUseLeafletLayer<E extends Layer, P extends EventedProps>(
  useElement: UseLeafletElement<E, P>,
) {
  return function useLeafletLayer(
    props: P,
  ): ReturnType<UseLeafletElement<E, P>> {
    const context = useLeafletContext()
    const elementRef = useElement(context, props)

    useLeafletEvents(elementRef.current, props.eventHandlers)
    useLeafletLayerLifecycle(elementRef.current, context)

    return elementRef
  }
}
