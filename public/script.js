//heyyy!!

let activeQuestionNode = null;

let nodes = [];
let nodeIdCounter = 0;

//START OF MIND-MAP ELEMENTS//
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d'); /* obtains rendering context-
or the provided methods, properties and ata to draw, color and
manipulat 2d graphics on a canvas; jere, for shapes,
text and images*/
const scale = window.devicePixelRatio;


function resizeCanvas() {
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);

  redrawMap();
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





//NODES//

    function drawQuestionNode( node, x, y) {
      const padding = 16;
      ctx.font = '13px Arial';
      const labelW = Math.max(ctx.measureText(node.label).width + padding *2, 200);


      ctx.fillStyle = '#69e3ff';
      ctx.fillRect(x-labelW/2, y- 20, labelW, 40);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, x, y);


      if(node.interactionType === 'multipleChoice' && node.options?.length > 0) {
        node.options.forEach((option, i) => {
          const optY = y + 45 + (i*35);
          const optW = ctx.measureText(option).width + padding *2;

          ctx.fillStyle = '#69e3ff';
          ctx.fillRect(x - optW/2, optY - 12, optW, 24);
          ctx.fillStyle = 'white';
          ctx.font = '11px Arial';
          ctx.fillText(option, x, optY);
  })}

    if(node.interactiontype === 'freeText') {
      ctx.fillStyle = '#69e3ff';
      ctx.fillRect(x-labelW/2, y- 20, labelW, 40);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, x, y);
      }
}


    function drawKnowledgeNode( node, x, y) {
      const padding = 16; 
      ctx.font = '13px Arial';
      const labelW = Math.max(ctx.measureText(node.label).width + padding * 2, 200);

      ctx.fillStyle = '#ffa569';
      ctx.fillRect(x - labelW/2, y - 20, labelW, 40);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, x, y);

    if (node.description) {
    ctx.font = '11px Arial';
    ctx.fillStyle = '#dddddd';
    const descLines = wrapText(ctx, node.description, 200);
    descLines.forEach((line, i) => {
      ctx.fillText(line, x, y + 35 + (i * 16));
    });
  }
    }

function drawNode(node, x, y) { //(node, x,y) are parameters in which placehold the content/features below.
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
  if (node.branches && node.branches.length > 0) {
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
  });}

  if(node.type === 'question') drawQuestionNode(node, x, y);
  else drawKnowledgeNode(node,  x, y);
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  nodes.forEach(node => {
    const hit = clickX > node.x - 80 && clickX < node.x + 80
    && clickY > node.y - 20 && clickY < node.y + 20;

    if (hit) handleNodeClick(node);
  });
});

function submitNodeAnswer(answer, node) {
  document.getElementById('nodeOverlay').style.display = 'none';

  //sends message exactly 
  const input = document.getElementById('userInput');
  input.value = answer;
  sendButton();
}
  //Hooks sub button for text input too
  document.getElementById('overlaySubmit').addEventListener('click', () => {
  const answer = document.getElementById('overlayInput').value.trim();
  if (!answer) return;

  submitNodeAnswer(answer, activeQuestionNode);

  });


function handleNodeClick(node) {
  console.log('clicked node:', node.label, 'type:', node.type);
  if (node.type !== 'question') return;
  //in this funciton, when the node is clicked, then we check if the node is  a question- yes, then...
  //calling the cool stuff...
  const overlay = document.getElementById('nodeOverlay');
  const question = document.getElementById('overlayQuestion');
  const optionsDiv= document.getElementById('overlayOptions');
  const textInput = document.getElementById('overlayInput');
  activeQuestionNode = node;

  //posiion towards the node
  const rect = canvas.getBoundingClientRect();
  overlay.style.left = (rect.left + node.x + 90) + 'px';
  overlay.style.top = (rect.top + node.y - 20) + 'px';

  question.textContent = node.label;
  optionsDiv.innerHTML = ' ';
  textInput.style.display = 'none';

  if(node.interactionType === 'multipleChoice' && node.options?.length > 0) {
    node.options.forEach(option => {
      const overlaySend= document.createElement('button');
      overlaySend.textContent = option;
      overlaySend.style.cssText = "display: block; width:100%; margin:4px 0; padding:8px; background:#2a2a2a; color:white; border-radius:8px; cursor:pointer; text-align:left;";
      overlaySend.addEventListener('click', () => submitNodeAnswer(option, node));
      optionsDiv.appendChild(overlaySend);
    });
  } else {
    textInput.style.display = 'block';
    textInput.value = ' ';
    textInput.focus();
  }
  overlay.style.display= 'block';
}


function addNode(label, description, type, parentId) {
  const parent = nodes.find(n => n.id === parentId); //Finds the specific parent node in the nodes array to establish the anchor point.
  const siblings = nodes.filter(n => n.parentId === parentId); // finds nodes witht he name parent (so we can distribute them)
  const angle = (siblings.length *60) - 60; //distributing space between two siblings

  //math
  const distance = 250;
  const rad= (angle *Math. PI) /180;

  const x = parent 
    ? parent.x + Math.cos(rad) * distance 
    : canvas.clientWidth / 2;
  const y = parent 
    ? parent.y + Math.sin(rad) * distance 
    : canvas.clientHeight / 2;

  const node = {
    id: nodeIdCounter++,
    label,
    description,
    type,
    parentId,
    x,
    y
  };
  //makes the node itself
  nodes.push(node); 
  return node;
}

function redrawMap() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  //clears everything

  nodes.forEach(node => {
    if(node.parentId!== null) { //if parent id 0, 
      const parent = nodes.find(n => n.id === node.parentId);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1.5
      ctx.beginPath();
      ctx.moveTo(parent.x, parent.y); //go to positions set above
      ctx.lineTo(node.x, node.y);
      ctx.stroke();
    }
  });

  nodes.forEach(node => {
    drawNode(node, node.x, node.y);
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
            userProfile,

            mindmapTree: nodes.map(n=> ({
              id: n.id,
              label: n.label,
              parentId: n.parentId
            })),
            activeNodeId: nodes.length > 0 ? nodes[nodes.length-1].id : null
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
  const parentId = data.parentNodeId ?? null;
  addNode(data.node.label, data.node.description, data.node.type, parentId);
  console.log(data.parentNodeId)
// determines id # of the node, and if it's a root or not. Then creates the nodes

  if (data.node.branches) {
    const parentNode = nodes[nodes.length -1];
    data.node.branches.forEach(branch => {
      addNode(branch, ' ', 'knowledge', parentNode.id);
    });
  }
  //here, identifies the nodes in which form they were added, in branches, and then essentially sorts them. The add node for the branch, it creates a label, empty pace for the description and it's id.

  redrawMap();
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