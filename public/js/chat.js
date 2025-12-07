// // Ensure XState is available (loaded via CDN in index.pug)
// const { createMachine, interpret } = XState;

// // --- 1. XState Machine Definition ---
// const reimbursementMachine = createMachine({
//     id: 'reimbursement',
//     initial: 'date',
//     context: {
//         formData: {},
//         currentInputType: 'date',
//         error: null,
//     },
//     states: {
//         date: {
//             on: {
//                 NEXT: {
//                     target: 'origin',
//                     cond: 'isValidDate',
//                     actions: ['saveData', 'clearError', 'setOriginInputType']
//                 }
//             },
//             meta: { botMsg: "Hi! What was the date of your trip? (YYYY-MM-DD)" }
//         },
//         origin: {
//             on: {
//                 NEXT: {
//                     target: 'destination',
//                     cond: 'isValidText',
//                     actions: ['saveData', 'clearError', 'setDestinationInputType']
//                 }
//             },
//             meta: { botMsg: "Where did your trip start? (e.g., Office Address)" }
//         },
//         destination: {
//             on: {
//                 NEXT: {
//                     target: 'reason',
//                     cond: 'isValidText',
//                     actions: ['saveData', 'clearError', 'setReasonInputType']
//                 }
//             },
//             meta: { botMsg: "And where did the trip end?" }
//         },
//         reason: {
//             on: {
//                 NEXT: {
//                     target: 'cost',
//                     cond: 'isValidText',
//                     actions: ['saveData', 'clearError', 'setCostInputType']
//                 }
//             },
//             meta: { botMsg: "What was the reason for this emergency ride?" }
//         },
//         cost: {
//             on: {
//                 NEXT: {
//                     target: 'receipt',
//                     cond: 'isValidCost',
//                     actions: ['saveData', 'clearError', 'setReceiptInputType']
//                 }
//             },
//             meta: { botMsg: "Total cost of the ride (USD)?" }
//         },
//         receipt: {
//             on: {
//                 NEXT: {
//                     target: 'review',
//                     cond: 'isValidFile',
//                     actions: ['saveData', 'clearError', 'setReviewInputType']
//                 }
//             },
//             meta: { botMsg: "Please upload your receipt (Image/PDF)." }
//         },
//         review: {
//             on: {
//                 SUBMIT_API: 'submitting'
//             },
//             meta: { botMsg: "Thanks! Review your data and click SUBMIT to finalize." }
//         },
//         submitting: {
//             invoke: {
//                 id: 'submitAPI',
//                 src: 'submitReimbursementAPI',
//                 onDone: {
//                     target: 'success',
//                     actions: 'setSuccessMessage'
//                 },
//                 onError: {
//                     target: 'error',
//                     actions: 'setErrorMessage'
//                 }
//             },
//             meta: { botMsg: "Submitting your reimbursement..." }
//         },
//         success: {
//             type: 'final',
//             meta: { botMsg: "Submission successful!" }
//         },
//         error: {
//             on: {
//                 RESTART: 'date'
//             },
//             meta: { botMsg: "Submission failed. Please check the console and click RESTART." }
//         }
//     }
// }, {
//     // --- 2. Guards (Validation Logic) ---
//     guards: {
//         isValidDate: (context, event) => !isNaN(new Date(event.value).getTime()) && new Date(event.value) <= new Date(),
//         isValidText: (context, event) => event.value && event.value.length > 5,
//         isValidCost: (context, event) => !isNaN(event.value) && Number(event.value) > 0,
//         isValidFile: (context, event) => event.value && event.value.files && event.value.files.length > 0,
//     },
//     // --- 3. Actions (State Mutators & UI side-effects) ---
//     actions: {
//         saveData: (context, event) => {
//             let valueToSave = event.value;
//             if (event.value && event.value.files) {
//                 valueToSave = event.value.files[0];
//             }
//             context.formData[event.key] = valueToSave;
//         },
//         clearError: (context) => {
//             context.error = null;
//         },
//         setSuccessMessage: (context, event) => {
//             context.successRefId = event.data.refId;
//         },
//         setErrorMessage: (context, event) => {
//             context.error = event.data.message || 'API submission failed.';
//         },
//         // Actions to update the context for dynamic input rendering
//         setOriginInputType: (context) => { context.currentInputType = { type: 'text', key: 'origin', error: "Address is too short." } },
//         setDestinationInputType: (context) => { context.currentInputType = { type: 'text', key: 'destination', error: "Address is too short." } },
//         setReasonInputType: (context) => { context.currentInputType = { type: 'text', key: 'reason', error: "Reason is too short." } },
//         setCostInputType: (context) => { context.currentInputType = { type: 'number', key: 'cost', error: "Please enter a positive cost." } },
//         setReceiptInputType: (context) => { context.currentInputType = { type: 'file', key: 'receipt', error: "Receipt file is required." } },
//         setReviewInputType: (context) => { context.currentInputType = { type: 'button', key: 'review' } },
//     },
//     // --- 4. Services (Async API calls) ---
//     services: {
//         submitReimbursementAPI: (context) => {
//             const dataToSend = new FormData();
//             for (const key in context.formData) {
//                 const value = context.formData[key];
//                 if (key === 'receipt') {
//                     dataToSend.append('receiptFile', value);
//                 } else {
//                     dataToSend.append(key, value);
//                 }
//             }

//             return fetch('/api/submit-reimbursement', {
//                 method: 'POST',
//                 body: dataToSend
//             }).then(response => {
//                 if (!response.ok) {
//                     throw new Error('Server returned non-200 status.');
//                 }
//                 return response.json();
//             });
//         }
//     }
// });


// // --- 5. DOM Manipulation and XState Service Setup ---

// const chatHistory = document.getElementById('chat-history');
// const inputContainer = document.getElementById('input-container');
// const debugView = document.getElementById('debug-view');
// const chatService = interpret(reimbursementMachine).start();


// function renderMessage(sender, text) {
//     const p = document.createElement('p');
//     p.className = sender;
//     p.innerHTML = `<strong>${sender === 'bot' ? 'Bot' : 'You'}:</strong> ${text}`;
//     chatHistory.appendChild(p);
//     chatHistory.scrollTop = chatHistory.scrollHeight;
// }

// function renderInput(state) {
//     const currentConfig = state.context.currentInputType;
//     inputContainer.innerHTML = '';

//     // Handle submission states
//     if (state.matches('submitting') || state.matches('success')) {
//         return;
//     }

//     // Handle Review/Submit button
//     if (state.matches('review')) {
//         const btn = document.createElement('button');
//         btn.textContent = "Submit Reimbursement";
//         btn.onclick = () => chatService.send('SUBMIT_API');
//         inputContainer.appendChild(btn);
//         return;
//     }

//     // Handle standard inputs
//     const input = document.createElement('input');
//     input.type = currentConfig.type === 'number' ? 'number' : (currentConfig.type === 'file' ? 'file' : 'text');
//     input.id = 'user-input';
//     if (currentConfig.type !== 'file') input.placeholder = 'Type here...';

//     const button = document.createElement('button');
//     button.textContent = currentConfig.type === 'file' ? 'Upload' : 'Send';

//     button.onclick = () => {
//         let value = currentConfig.type === 'file' ? { files: input.files } : input.value;
//         let displayValue = currentConfig.type === 'file' ? `[File: ${input.files[0] ? input.files[0].name : 'N/A'}]` : value;

//         // XState guard logic runs first. If it passes, the state advances and actions run.
//         chatService.send({ type: 'NEXT', value: value, key: currentConfig.key });

//         // Only render user message if the state actually changed (i.e., validation passed)
//         if (!state.context.error) {
//             renderMessage('user', displayValue);
//         }
//     };

//     input.onkeydown = (e) => {
//         if (e.key === 'Enter' && currentConfig.type !== 'file') button.click();
//     };

//     inputContainer.appendChild(input);
//     inputContainer.appendChild(button);
//     input.focus();
// }

// // --- 6. XState Subscription for UI Updates ---
// chatService.onTransition(state => {
//     // 1. Render Bot Message (Based on current state's meta data)
//     const botMsg = state.meta[`reimbursement.${state.value}`]?.botMsg;
//     if (botMsg && !state.changed) {
//         let finalMsg = botMsg;
//         if (state.matches('success')) {
//             finalMsg = `${botMsg} Ref ID: **${state.context.successRefId}**`;
//         }
//         renderMessage('bot', finalMsg);
//     }

//     // 2. Render Error Message
//     if (state.context.error) {
//         renderMessage('bot', `❌ Error: ${state.context.error}`);
//         state.context.error = null;
//     }

//     // 3. Render Input Field
//     renderInput(state);

//     // 4. Update Debug View (Data Structure)
//     const displayData = { ...state.context.formData };
//     if (displayData.receipt) {
//         displayData.receipt = `[File: ${displayData.receipt.name}]`;
//     }
//     debugView.textContent = JSON.stringify(displayData, null, 2);
// });

// // Initial bot message on service start
// chatService.onTransition(state => {
//     if (state.changed) {
//         const botMsg = state.meta[`reimbursement.${state.value}`]?.botMsg;
//         if (botMsg) {
//             renderMessage('bot', botMsg);
//         }
//     }
// });

// Ensure XState is available (loaded via CDN in index.pug)
const { createMachine, interpret } = XState;

// --- 1. XState Machine Definition ---
const reimbursementMachine = createMachine({
    id: 'reimbursement',
    initial: 'date',
    context: {
        formData: {},
        // FIX: Define the initial input type with the correct 'serviceDate' key
        currentInputType: { type: 'date', key: 'serviceDate', error: "Invalid date." }, 
        error: null,
    },
    states: {
        date: {
            on: {
                NEXT: { 
                    target: 'origin',
                    cond: 'isValidDate',
                    // FIX: Removed redundant setDateInputType action
                    actions: ['saveData', 'clearError', 'setOriginInputType'] 
                }
            },
            meta: { botMsg: "Hi! What was the date of your trip? (YYYY-MM-DD)" }
        },
        origin: {
            on: {
                NEXT: {
                    target: 'destination',
                    cond: 'isValidText',
                    actions: ['saveData', 'clearError', 'setDestinationInputType']
                }
            },
            meta: { botMsg: "Where did your trip start? (e.g., Office Address)" }
        },
        destination: {
            on: {
                NEXT: {
                    target: 'reason',
                    cond: 'isValidText',
                    actions: ['saveData', 'clearError', 'setReasonInputType']
                }
            },
            meta: { botMsg: "And where did the trip end?" }
        },
        reason: {
            on: {
                NEXT: {
                    target: 'cost',
                    cond: 'isValidText',
                    actions: ['saveData', 'clearError', 'setCostInputType']
                }
            },
            meta: { botMsg: "What was the reason for this emergency ride?" }
        },
        cost: {
            on: {
                NEXT: {
                    target: 'receipt',
                    cond: 'isValidCost',
                    actions: ['saveData', 'clearError', 'setReceiptInputType']
                }
            },
            meta: { botMsg: "Total cost of the ride (USD)?" }
        },
        receipt: {
            on: {
                NEXT: {
                    target: 'review',
                    cond: 'isValidFile',
                    actions: ['saveData', 'clearError', 'setReviewInputType']
                }
            },
            meta: { botMsg: "Please upload your receipt (Image/PDF)." }
        },
        review: {
            on: {
                SUBMIT_API: 'submitting'
            },
            meta: { botMsg: "Thanks! Review your data and click SUBMIT to finalize." }
        },
        submitting: {
            invoke: {
                id: 'submitAPI',
                src: 'submitReimbursementAPI',
                onDone: {
                    target: 'success',
                    actions: 'setSuccessMessage'
                },
                onError: {
                    target: 'error',
                    actions: 'setErrorMessage'
                }
            },
            meta: { botMsg: "Submitting your reimbursement..." }
        },
        success: {
            type: 'final',
            meta: { botMsg: "Submission successful!" }
        },
        error: {
            on: {
                RESTART: 'date'
            },
            meta: { botMsg: "Submission failed. Please check the console and click RESTART." }
        }
    }
}, {
    // --- 2. Guards (Validation Logic) ---
    guards: {
        isValidDate: (context, event) => !isNaN(new Date(event.value).getTime()) && new Date(event.value) <= new Date(),
        isValidText: (context, event) => event.value && event.value.length > 5,
        isValidCost: (context, event) => !isNaN(event.value) && Number(event.value) > 0,
        isValidFile: (context, event) => event.value && event.value.files && event.value.files.length > 0,
    },
    // --- 3. Actions (State Mutators & UI side-effects) ---
    actions: {
        saveData: (context, event) => {
            let valueToSave = event.value;
            if (event.value && event.value.files) {
                valueToSave = event.value.files[0];
            }
            // FIX: event.key is now correctly set to 'serviceDate' for the first step
            context.formData[event.key] = valueToSave; 
        },
        clearError: (context) => {
            context.error = null;
        },
        setSuccessMessage: (context, event) => {
            context.successRefId = event.data.refId;
        },
        setErrorMessage: (context, event) => {
            context.error = event.data.message || 'API submission failed.';
        },
        // Actions to update the context for dynamic input rendering
        setOriginInputType: (context) => { context.currentInputType = { type: 'text', key: 'origin', error: "Address is too short." } },
        setDestinationInputType: (context) => { context.currentInputType = { type: 'text', key: 'destination', error: "Address is too short." } },
        setReasonInputType: (context) => { context.currentInputType = { type: 'text', key: 'reason', error: "Reason is too short." } },
        setCostInputType: (context) => { context.currentInputType = { type: 'number', key: 'cost', error: "Please enter a positive cost." } },
        setReceiptInputType: (context) => { context.currentInputType = { type: 'file', key: 'receipt', error: "Receipt file is required." } },
        setReviewInputType: (context) => { context.currentInputType = { type: 'button', key: 'review' } },
    },
    // --- 4. Services (Async API calls) ---
    services: {
        submitReimbursementAPI: (context) => {
            const dataToSend = new FormData();
            for (const key in context.formData) {
                const value = context.formData[key];
                if (key === 'receipt') {
                    dataToSend.append('receiptFile', value); 
                } else {
                    dataToSend.append(key, value);
                }
            }
            
            return fetch('/api/submit-reimbursement', {
                method: 'POST',
                body: dataToSend
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Server returned non-200 status.');
                }
                return response.json();
            });
        }
    }
});


// --- 5. DOM Manipulation and XState Service Setup ---

const chatHistory = document.getElementById('chat-history');
const inputContainer = document.getElementById('input-container');
const debugView = document.getElementById('debug-view');
const chatService = interpret(reimbursementMachine).start();


function renderMessage(sender, text) {
    const p = document.createElement('p');
    p.className = sender;
    p.innerHTML = `<strong>${sender === 'bot' ? 'Bot' : 'You'}:</strong> ${text}`;
    chatHistory.appendChild(p);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function renderInput(state) {
    const currentConfig = state.context.currentInputType;
    inputContainer.innerHTML = '';
    
    // Handle submission states
    if (state.matches('submitting') || state.matches('success')) {
        return;
    }
    
    // Handle Review/Submit button
    if (state.matches('review')) {
        const btn = document.createElement('button');
        btn.textContent = "Submit Reimbursement";
        btn.onclick = () => chatService.send('SUBMIT_API');
        inputContainer.appendChild(btn);
        return;
    }
    
    // Handle standard inputs
    const input = document.createElement('input');
    input.type = currentConfig.type === 'number' ? 'number' : (currentConfig.type === 'file' ? 'file' : 'text');
    input.id = 'user-input';
    if (currentConfig.type !== 'file') input.placeholder = 'Type here...';

    const button = document.createElement('button');
    button.textContent = currentConfig.type === 'file' ? 'Upload' : 'Send';
    
    button.onclick = () => {
        let value = currentConfig.type === 'file' ? { files: input.files } : input.value;
        let displayValue = currentConfig.type === 'file' ? `[File: ${input.files[0] ? input.files[0].name : 'N/A'}]` : value;

        // XState guard logic runs first. If it passes, the state advances and actions run.
        chatService.send({ type: 'NEXT', value: value, key: currentConfig.key });
        
        // Only render user message if the state actually changed (i.e., validation passed)
        if (!state.context.error) {
            renderMessage('user', displayValue);
        }
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter' && currentConfig.type !== 'file') button.click();
    };

    inputContainer.appendChild(input);
    inputContainer.appendChild(button);
    input.focus();
}

// --- 6. XState Subscription for UI Updates ---
chatService.onTransition(state => {
    // 1. Render Bot Message (Based on current state's meta data)
    const botMsg = state.meta[`reimbursement.${state.value}`]?.botMsg;
    if (botMsg && !state.changed) { 
        let finalMsg = botMsg;
        if (state.matches('success')) {
            finalMsg = `${botMsg} Ref ID: **${state.context.successRefId}**`;
        }
        renderMessage('bot', finalMsg);
    }
    
    // 2. Render Error Message
    if (state.context.error) {
        renderMessage('bot', `❌ Error: ${state.context.error}`);
        state.context.error = null;
    }
    
    // 3. Render Input Field
    renderInput(state);
    
    // 4. Update Debug View (Data Structure)
    const displayData = { ...state.context.formData };
    if (displayData.receipt) {
        displayData.receipt = `[File: ${displayData.receipt.name}]`;
    }
    debugView.textContent = JSON.stringify(displayData, null, 2);
});

// Initial bot message on service start
chatService.onTransition(state => {
    if (state.changed) {
        const botMsg = state.meta[`reimbursement.${state.value}`]?.botMsg;
        if (botMsg) {
            renderMessage('bot', botMsg);
        }
    }
});