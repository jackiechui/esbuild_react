const { widget } = figma;
const { Text, useEffect } = widget;

function Widget() {
  useEffect(() => {
    figma.ui.on('message', (msg) => {
      if (msg === 'hello') {
        figma.notify(`Hello ${figma.currentUser.name}`);
      }
      if (msg === 'close') {
        figma.closePlugin();
      }
    });
  });

  return (
    <Text
      fontSize={32}
      onClick={async () =>
        new Promise((resolve) => {
          figma.showUI(__html__);
        })
      }
    >
      Click Me
    </Text>
  );
}

widget.register(Widget);
