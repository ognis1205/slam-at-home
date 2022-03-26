/**
 * @fileoverview Defines Modal component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Content from './content';
import * as Context from './context';
import * as Props from './props';
import * as Portal from '../portal';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';
import * as Popup from '../../utils/popup';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/components/modal.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Modal> = {
  //  placement: 'left',
  container: 'body',
  defaultOpen: false,
  delay: 200,
};

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames(styles['portal'], {
    [className || '']: !!className,
  });

/** Returns a `Modal` component. */
const Component = React.forwardRef<Props.Trigger, Props.Modal>(
  (
    {
      children,
      className,

      container,

      offset,
      open,
      defaultOpen,
      disabled,
      onOpen,
      onClose,
      position,
      delay,

      repositionOnResize,
      keepTooltipInside,

      ...commonProps
    }: Props.Modal,
    ref: React.ForwardedRef<Props.Trigger>
  ): React.ReactElement => {
    /** @const Holds a open state. */
    const [isOpen, setOpen] = React.useState<boolean>(
      typeof open !== 'undefined' ? open : !!defaultOpen
    );

    /** @const Holds a component's identifier. */
    const id = React.useRef<string>(
      `modal_id_${Number(
        (Date.now() + Math.random())
          .toString()
          .replace('.', Math.round(Math.random() * 9).toString())
      ).toString(16)}`
    );

    /** @const Holds `true` if the component is modal. */
    const isModal = commonProps.modal ? true : !commonProps.trigger;

    /** @const Holds a reference to the component itself. */
    const self = React.useRef<HTMLDivElement>(null);

    /** @const Holds a reference to the trigger. */
    const trigger = React.useRef<HTMLElement>(null);

    /** @const Holds a reference to the contentg. */
    const content = React.useRef<HTMLDivElement>(null);

    /** @const Holds a reference to the focused element. */
    const focusedBeforeOpen = React.useRef<Element>(null);

    /** @const Holds a mouse enter effect. */
    const timeout = React.useRef<ReturnType<typeof setTimeout>>(null);

    /** Defines trigger. */
    React.useImperativeHandle(ref, () => ({
      open: () => {
        handleOpen();
      },
      close: () => {
        handleClose();
      },
      toggle: () => {
        handleToggle();
      },
    }));

    /** `componentDidMount` and `componentDidUpdate`. */
    Hook.useLayoutEffect(() => {
      if (isOpen) {
        if (DOM.isDefined()) focusedBeforeOpen.current = document.activeElement;
        setPosition();
        focus();
      }
      return () => {
        clearTimeout(timeout.current);
      };
    }, [isOpen]);

    /** `componentDidMount` */
    Hook.useDidMount(() => {
      if (!DOM.isDefined() || !repositionOnResize) return;
      Event.addListener(window, 'resize', setPosition);
    });

    /** `componentWillUnmount` */
    Hook.useWillUnmount(() => {
      if (!DOM.isDefined() || !repositionOnResize) return;
      Event.removeListener(window, 'resize', setPosition);
    });

    /** `getDerivedStateFromProps` */
    React.useEffect(() => {
      if (typeof open === 'boolean') {
        if (open) handleOpen();
        else handleClose();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, disabled]);

    /** Toggles `isOpen` state. */
    const handleToggle = (e?: React.SyntheticEvent) => {
      e?.stopPropagation();
      if (!isOpen) handleOpen(e);
      else handleClose(e);
    };

    /** Focuses on `open`event. */
    const focus = () => {
      const candidates = content?.current?.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
      const focusiable = Array.prototype.slice.call(candidates)[0];
      focusiable?.focus();
    };

    /** An event handler called on `open` events. */
    const handleOpen = (e?: React.SyntheticEvent) => {
      if (isOpen || disabled) return;
      setOpen(true);
      setTimeout(() => onOpen(e), 0);
    };

    /** An event handler called on `close` events. */
    const handleClose = (
      e?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
    ) => {
      if (!isOpen || disabled) return;
      setOpen(false);
      if (DOM.isDefined() && isModal)
        (focusedBeforeOpen.current as HTMLElement)?.focus();
      setTimeout(() => onClose(e), 0);
    };

    /** An event handler called on `mouseenter` events. */
    const handleMouseEnter = (e?: React.SyntheticEvent) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => handleOpen(e), delay);
    };

    /** An event handler called on `mouseleave` events. */
    const handleMouseLeave = (e?: React.SyntheticEvent) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => handleClose(e), delay);
    };

    /** An event handler called on `context` events. */
    const handleContextMenu = (e?: React.SyntheticEvent) => {
      e?.preventDefault();
      handleToggle();
    };

    /** Sets the position. */
    const setPosition = () => {
      if (
        !DOM.isDefined() ||
        isModal ||
        !isOpen ||
        !trigger?.current ||
        !content?.current
      )
        return;
      const coord = Popup.getPosition(
        trigger.current.getBoundingClientRect(),
        content.current.getBoundingClientRect(),
        position,
        offset,
        keepTooltipInside
      );
      content.current.style.top = `${coord.top + window.scrollY}px`;
      content.current.style.left = `${coord.left + window.scrollX}px`;
    };

    /** Renders trigger element. */
    const renderTrigger = (): JSX.Element => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props: any = {
        key: 'T',
        ref: (el) => (trigger.current = el),
        'aria-describedby': id.current,
      };

      const on = Array.isArray(commonProps.on)
        ? commonProps.on
        : [commonProps.on];
      on.forEach((e) => {
        switch (e) {
          case 'click':
            props.onClick = handleToggle;
            break;
          case 'right-click':
            props.onContextMenu = handleContextMenu;
            break;
          case 'hover':
            props.onMouseEnter = handleMouseEnter;
            props.onMouseLeave = handleMouseLeave;
            break;
          case 'focus':
            props.onFocus = handleMouseEnter;
            props.onBlur = handleMouseLeave;
            break;
          default:
        }
      });

      if (typeof commonProps.trigger === 'function') {
        const jsx = commonProps.trigger(isOpen);
        return !!commonProps.trigger && React.cloneElement(jsx, props);
      }
      return (
        !!commonProps.trigger && React.cloneElement(commonProps.trigger, props)
      );
    };

    if (!container)
      return (
        <React.Fragment>
          {renderTrigger()}
          <div
            className={getClassName(className)}
            ref={(el) => (self.current = el)}
          >
            <Content.Component
              {...commonProps}
              className={className}
              ref={(el) => (content.current = el)}
            >
              {children}
            </Content.Component>
          </div>
        </React.Fragment>
      );
    else
      return (
        <React.Fragment>
          {renderTrigger()}
          <Portal.Wrapper
            visible={isOpen}
            container={container}
            className={getClassName(className)}
          >
            {(contentProps: Props.Content) => (
              <Context.Modal.Provider
                value={{
                  id: id.current,
                  isOpen: isOpen,
                  openHandler: handleOpen,
                  closeHandler: handleClose,
                  mouseEnterHandler: handleMouseEnter,
                  mouseLeaveHandler: handleMouseLeave,
                }}
              >
                <Content.Component
                  {...commonProps}
                  {...contentProps}
                  className={className}
                  ref={(el) => (content.current = el)}
                >
                  {children}
                </Content.Component>
              </Context.Modal.Provider>
            )}
          </Portal.Wrapper>
        </React.Fragment>
      );
  }
);

/** Sets the component's display name. */
Component.displayName = 'Modal';

/** Returns a `Modal` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Modal> =
  Wrap.withDefaultProps(Component, DEFAULT_PROPS);
