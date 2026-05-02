//heyyy!!



//START OF MIND-MAP ELEMENTS//
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d'); /* obtains rendering context-
or the provided methods, properties and ata to draw, color and
manipulat 2d graphics on a canvas; jere, for shapes,
text and images*/
const scale = window.devicePixelRatio;
let nodes = [];


function resizeCanvas() {
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);

  nodes.forEach(n => drawNode(n.node, n.x, n.y));
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);



//TEXT NODES//
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach(word => {
    const test = current + word + ' ';
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current.trim());
      current = word + ' ';
    } else {
      current = test;
    }
  });
  lines.push(current.trim());
  return lines;
}

function drawNode(node, x, y) {
  const lineHeight = 16;
  const padding = 16;

  // MAIN LABEL BOX
  ctx.font = 'bold 14px Arial';
  const labelW = ctx.measureText(node.label).width + padding * 2;
  ctx.fillStyle = '#2f6df5';
  ctx.fillRect(x - labelW/2, y - 20, labelW, 40);
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.label, x, y);

  // DESCRIPTION
  ctx.font = '11px Arial';
  ctx.fillStyle = '#dddddd';
  const descLines = wrapText(ctx, node.description, 200);
  descLines.forEach((line, i) => {
    ctx.fillText(line, x, y + 35 + (i * lineHeight));
  });

  const descHeight = descLines.length * lineHeight;

  // BRANCHES
  node.branches.forEach((branch, index) => {
    const branchY = y + 55 + descHeight + (index * 35);
    ctx.font = '11px Arial';
    const branchW = ctx.measureText(branch).width + padding * 2;
    ctx.fillStyle = '#1a4fc4';
    ctx.fillRect(x - branchW/2, branchY - 12, branchW, 24);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(branch, x, branchY);
  });
}

/* canvas MUST ALWAYS prioritize/use canvas propeties,
which are usually in fillRect, circle, etc. etc. so it's a bti
different, but the same conceptually. It's mroe to the point!*/
//END OF MIND-MAP ELEMENTS//



//START OF API CALLING + MESSAGE INTERACTION//

const messages = document.getElementById('messages');
const input = document.getElementById('userInput');
const button = document.getElementById("sendButton");

//calling html features

let history = []
//let means reassignable, so history can VARY

const userProfile = "Learns best through analogies and humor. Prefers short explanations.";
//^^PLACEHOLDER FOR NOW< DYNAMIC LATER^^

function addMessage(role, text) {
    const div = document.createElement('div');
    div.classList.add('message', role);
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

/*declaing a new function, 'addMessage', and then set parameters the function
can accept; so role, to let the user/bot determine who sent the message, and text
the actual content. then it creates a div for the message; and class list adds it to
css styling. text content allows the text to sit inside of the div, then we append, or
 to the div, and then auto scrolling to the top!*/

async function sendButton() {
    const text = input.value.trim();
    if(!text) return;

    addMessage('user', text);
    input.value = '';

    history.push({role: 'user', content: text});

    const response = await fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            message: text,
            history: history.slice(0, -1),
            userProfile 
        })
        })
        /* fetches the chat responses, the posts, takes the content
        and sends iit to .json, reads, and then indicates what data it's transfering
        and responding back with from the history+ user profile.*/
    const data = await response.json();
    console.log(data);
    addMessage('assistant', data.reply);
    //reccieve and log response here

if (data.node) {
  const centerX = canvas.clientWidth / 2;
  const spacingX = Math.min(250, canvas.clientWidth * 0.3);

  const x = history.length === 2
    ? centerX
    : centerX + spacingX;

  const y = (history.length * 80) % canvas.clientHeight;

  nodes.push({ node: data.node, x, y }); // store for redraw
  drawNode(data.node, x, y);
}

    history.push({ role: 'assistant', content: data.reply });
/* makes a file for json to read it, then awaits to make sure it's fully complee
then addMessage tells the app to display the new message, and history.push updates
the data*/
    }

    button.addEventListener('click', sendButton);
    input.addEventListener('keydown', e => {
        if(e.key ==='Enter') sendButton(); /*send button controls to send messages to api to respond*/
    });

    //btw e is event object

//END OF API CALLING + MESSAGE INTERACTION//