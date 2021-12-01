/**
 * @fileoverview Defines Wrapper component.
 */
import * as React from 'react';
import * as Content from './content';
import * as Props from './props';
import * as Portal from '../portal';

/**
 * Returns a `Wrapper` component.
 * @param {Wrapper} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Wrapper> = (props: Props.Wrapper): React.ReactElement => {
  /** @const Holds a open state. */
  const [open, setOpen] = React.useState<boolean>(
    typeof props.open !== 'undefined'
    ? props.open
    : !!props.defaultOpen);

  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  /** An event handler called on 'clickevent' events. */
  const onHandleClick = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (props.onHandleClick)
      props.onHandleClick(e);
    if (typeof props.open === 'undefined')
      setOpen(!open);
  };

  /** An event handler called on 'clickevent' events. */
  const onClose = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (props.onClose)
      props.onClose(e);
    if (typeof props.open === 'undefined')
      setOpen(false);
  };

  /** Separates commom properties. */
  const {
    container,
    wrapperClass,
    forceRender,
    ...commonProps
  } = props;

  if (!container)
    return (
      <div
        className={wrapperClass}
        ref={self}
      >
        <Content.Component
          {...commonProps}
          open={open}
          container={() => self.current as HTMLElement}
          onClose={onClose}
          onHandleClick={onHandleClick}
        />
      </div>
    );
  else
    return (
      <Portal.Provider
        visible={open}
        forceRender={!!commonProps.handler || forceRender}
        container={container}
        wrapperClass={wrapperClass}
      >
        {({visible, afterClose, ...rest}: Props.Content) => (
          <Content.Component
            {...commonProps}
            open={visible !== undefined ? visible : open}
            afterVisibleChange={
              afterClose !== undefined ? afterClose : commonProps.afterVisibleChange
            }
            onClose={onClose}
            onHandleClick={onHandleClick}
          />
        )}
      </Portal.Provider>
    );
};