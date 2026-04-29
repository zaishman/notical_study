//heyyy!!

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
    addMessage('assistant', data.reply);

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