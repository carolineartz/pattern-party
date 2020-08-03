import React from 'react'
import { Layer, LayerProps } from 'grommet'

type ToastProps = LayerProps & {
  duration: number
  onClose: Function
}

export class Toast extends React.Component<ToastProps, {}> {
  timeoutAutoHide?: number

  componentDidMount() {
    this.startAutoHideTimeout()
  }

  componentWillUnmount() {
    if (this.timeoutAutoHide) {
      clearTimeout(this.timeoutAutoHide)
    }
  }

  startAutoHideTimeout = () => {
    const { duration, onClose } = this.props

    if (duration) {
      this.timeoutAutoHide = setTimeout(() => {
        onClose()
      }, duration * 1000)
    }
  }

  render() {
    const { children, modal, position, full, ...rest } = this.props

    return (
      <Layer
        position={position || 'top'}
        full="horizontal"
        modal={modal}
        margin="none"
        responsive
        plain={modal ? false : true}
        {...rest}
      >
        {children}
      </Layer>
    )
  }
}
