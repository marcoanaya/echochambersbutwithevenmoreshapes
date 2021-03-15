const questionStyle = 'font-size: 20px;color: blue; text-shadow: 1px 1px 0 rgb(0,20,20)';
const inputStyle = '';
const errorStyle = 'font-weight: bold; font-size: 20px;color: red; text-shadow: 1px 1px 0 rgb(217,31,38) , 1px 1px 0 rgb(0,0,0)';

const shapes = {
  triangle: 3,
  square: 4,
  hexagon: 6,
  circle: 24,
};

const isValidColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;

  // return 'false' if color wasn't assigned
  return s.color === strColor.toLowerCase();
};

const confirm = (input, yes, no, typo) => {
  if (input.length < 1) return typo;
  return input[0] !== 'y'
    ? input[0] !== 'n'
      ? typo
      : no
    : yes;
};

const initialDialog = {
  greeting: (input, { name }) => ({
    text: `hello there ${name || 'stranger'}`,
    subtext: [
      [
        'can you help us out here? wat you\'re looking at here is a platform',
        'where shapes can come together and share their thoughts and interests.',
        'we are trying to maximize their engagement and were needing some fresh eyes on this.',
        'we don\'t have any money to give you but if you do well, we can add you to our list of',
        'cool shapes, for all to see. \n\n(you can say yes by typing \'y\' and pressing the \'enter\' key)',
      ].join(' '),
      '',
    ],
    error: 'fine',
    goto: { i: confirm(input, 'name', 'greeting', 'greeting') },
  }),
  name: (input) => ({
    text: 'wat is your name?',
    subtext: ['you need at least an alphabetic character in there'],
    error: 'thats not a valid name',
    goto: !(input.length < 20 && input.length > 1 && /[a-zA-Z]/g.test(input))
      ? { i: 'name' }
      : { i: 'confirmName', name: input },
  }),
  confirmName: (input) => ({
    text: 'are you sure?',
    subtext: ['\'y\' for yes, \'n\' for no'],
    error: 'y or n',
    goto: confirm(
      input,
      { i: 'shapeSides' },
      { i: 'name', name: '' },
      { i: 'confirmName' },
    ),
  }),
  shapeSides: (input) => ({
    text: 'wat shape do u wanna be?',
    subtext: [`valid shapes are: ${Object.keys(shapes).map((s) => `'${s}'`)}`],
    error: 'thats not a valid shape',
    goto: !(input in shapes)
      ? { i: 'shapeSides' }
      : { i: 'shapeColor', shape: { sides: shapes[input], c: 0 } },
  }),
  shapeColor: (input, { shape: { sides } }) => ({
    text: 'wat color do u want ur shape to be?',
    subtext: ['any css color should work, like \'azure\', \'goldenrod\'\'mediumseagreen\''],
    error: 'thats not a valid color',
    goto: !isValidColor(input)
      ? { i: 'shapeColor' }
      : { i: 'confirmShape', shape: { sides, c: input } },
  }),
  confirmShape: (input) => ({
    text: 'look at your lil shape go :^0',
    subtext: ['are you sure about the shape you have chosen?'],
    error: 'y or n',
    goto: confirm(
      input,
      { i: 'explanation' },
      { i: 'shapeSides', shape: { sides: 3, c: 0 } },
      { i: 'confirmShape' },
    ),
  }),
  explanation: (input, { name }) => ({
    text: `ok ${name || 'stranger'}, so here's the plan`,
    subtext: [
      [
        'you see those rings coming out of the shapes?? those show up every time a shape',
        'shares a post with the world. we want to maximize those',
        '(more posting == more seeing ads, more data, etc... you know the  drill.)',
        'we have this model that helps us decide which shapes we nudge closer together',
        'and which shapes\' posts can reach a greater audience.',
        '\n\nyou\'re gonna be helping us choose the parameters for the model,',
        'to see if we can improve our engagement, ok?',
      ].join(' '),
    ],
    error: 'say ok',
    goto: {
      i: !['ok', 'sounds good'].some((h) => input.includes(h))
        ? 'explanation'
        : 'param0',
    },
  }),
  param6: (input, userInfo) => ({
    text: `ok ${userInfo.name || 'stranger'} just confirm all ur info:`,
    subtext: [userInfo.toString()],
    error: 'y or n',
    goto: confirm(
      input,
      { i: 'end', doCheck: true },
      { i: 'name' },
      { i: 'param6' },
    ),
  }),
  end: (input, { name }) => ({
    text: `good job ${name || 'stranger'}. if u wanna change ur info or the parameters, lmk`,
    error: 'unless u wanna change ur info (\'name\') or parameters (\'param\'), we r done here',
    goto: {
      i: !input.includes('name')
        ? !input.includes('param')
          ? 'end'
          : 'param0'
        : 'name',
    },
  }),
  back: (input, { name }) => ({
    text: `welcome back ${name || 'stranger'}. if u wanna change ur info or the parameters, lmk`,
    error: 'unless u wanna change ur info (\'name\') or parameters (\'param\'), we r done here',
    goto: {
      i: !input.includes('name')
        ? !input.includes('param')
          ? 'back'
          : 'param0'
        : 'name',
    },
  }),
};

const paramDialog = [
  {
    text: 'how to update direction',
    subtext: [[
      'i\'m sure you\'ve noticed the color of the shapes. this encodes their lil shape interests/shape ideology',
      'on a spectrum between cyan and magenta.',
      '\n\nwe have noticed that the shapes tend to have a higher engagement',
      'when they can view and share their thoughts with shapes of a similar color.',
      'choose by how much a shape should move when it encounters a similarly colored shape.',
      '\n\nThis number should ideally be positive, which will move similar shapes closer together.',
      'you can technically make it negative, but why would you do that?\n\n (-5 <= x <= 5)',
    ].join(' ')],
    isValid: (x) => Math.abs(x) <= 5,
    questionChoice: (x) => (x <= 0
      ? 'that doesn\'t seem like a great approach, given what we know about the shapes..'
      : x <= 2.5
        ? 'it seems like a fine choice, just making sure :^o'
        : 'thats bold ;^o'),
  },
  {
    text: 'post visibility',
    subtext: [[
      'we have found success in highlighting posts from certain shapes, specifically those that are very cyan or very magenta.',
      'what methodology should we take when highlighting posts? (choose the number):',
      '\n 1) neural\n 2) cyan-leaning\n 3) magenta-leaning\n 4) either very cyan or very magenta',
    ].join(' ')],
    isValid: (x) => [1, 2, 3, 4].includes(x),
    questionChoice: (x) => (x === 1
      ? 'i don\'t know how i feel about that.. the shapes aren\'t gonna wanna interact'
      : (x === 2 || x === 3)
        ? 'it seems like a good choice, but idk if the press will like that \':^0'
        : 'yeah seems about right ;^o'),
  },
  {
    text: 'directional randomness',
    subtext: [[
      'we have noticed that if we allow some randomness in how we move the shapes, they will be more likely to find',
      'a community where they can achieve high engagement. if we make this too high, it\'ll make things too crazyy.',
      'choose a positive number <= 10, and beware when it gets too large',
    ].join(' ')],
    isValid: (x) => x >= 0 && x <= 10,
    questionChoice: (x) => (x >= 5
      ? 'watch out this might be too large \':^0'
      : 'looks ok ;^o'),
  },
].reduce((acc, {
  text, subtext, isValid, questionChoice,
}, j) => {
  const i = j * 2;
  const letter = String.fromCharCode(65 + j);
  acc[`param${i}`] = (input, { params }) => ({
    text,
    subtext,
    error: 'that is not a valid input',
    goto: (Number.isNaN(Number(input)) || !isValid(Number(input)))
      ? { i: `param${i}` }
      : { i: `param${i + 1}`, params: { ...params, [letter]: Number(input) } },
  });
  acc[`param${i + 1}`] = (input, { params }) => ({
    text: 'are you sure?',
    subtext: [questionChoice(params[letter])],
    error: '>:^( y or n',
    goto: input !== 'y'
      ? input !== 'n'
        ? { i: `param${i + 1}` }
        : { i: `param${i}`, params: { ...params, [letter]: 0 } }
      : { i: `param${i + 2}` },
  });
  return acc;
}, {});

const dialog = { ...initialDialog, ...paramDialog };
export {
  dialog,
  questionStyle,
  inputStyle,
  errorStyle,
};
