//heyyy!!



//START OF MIND-MAP ELEMENTS//
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d'); /* obtains rendering context-
or the provided methods, properties and ata to draw, color and
manipulat 2d graphics on a canvas; jere, for shapes,
text and images*/
const scale = window.devicePixelRatio;

window.addEventListener('load', () => {
canvas.width = canvas.clientWidth * scale; /*returns full layout width in pixels*/
canvas.height = canvas.clientHeight * scale;
ctx.scale(scale, scale);
});

function drawNode(node, x,y) {
ctx.fillStyle = '#2f6df5';
ctx.fillRect(x - 80, y - 25, 160, 50);
ctx.font = '16px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = 'white';
ctx.fillText(node.label, x, y);

ctx.fillStyle = '#cccccc';
ctx.font = '11px Arial';
ctx.fillStyle = 'black'
ctx.fillText(node.description, x, y +40);

node.branches.forEach((branch, index) => {
const branchY = y + 70 + (index * 30);
ctx.fillRect(x - 70, branchY - 12, 140, 24);
ctx.fillStyle = 'red';
ctx.font = '12px Arial';
ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
ctx.fillText(branch, x, branchY);
})
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
    input.value = ' ';

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

    console.log('canvas size:', canvas.clientWidth, canvas.clientHeight);
    console.log('drawing node:', data.node);

        if(history.length === 2) {
        drawNode(data.node, canvas.clientWidth/2, canvas.clientHeight/2); //puts in the node input, which is the short big title if the message is 1st
    }
    else {
        drawNode(data.node, canvas.clientWidth/2 + 250, history.length * 80);
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