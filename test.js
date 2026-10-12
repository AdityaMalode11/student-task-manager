

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

// Create a small mock DOM for testing script.js
function createElement() {
    const element = {
        value: '',
        textContent: '',
        children: [],
        classes: [],
        appendChild(child) {
            this.children.push(child);
        },
        classList: {
            add(name) {
                element.classes.push(name);
            }
        }
    };

    Object.defineProperty(element, 'innerHTML', {
        get() {
            return element._innerHTML || '';
        },
        set(value) {
            element._innerHTML = value;
            if (value === '') {
                element.children = [];
            }
        }
    });

    return element;
}

function createApp() {
    const elements = {
        taskInput: createElement(),
        priorityInput: createElement(),
        taskList: createElement(),
        totalTasks: createElement(),
        completedTasks: createElement(),
        pendingTasks: createElement()
    };

    const alerts = [];

    const context = {
        document: {
            getElementById(id) {
                return elements[id] || null;
            },
            createElement
        },
        alert(message) {
            alerts.push(message);
        }
    };

    vm.runInNewContext(
        fs.readFileSync('script.js', 'utf8'),
        context
    );

    return { elements, alerts, context };
}

function addTask(app, text, priority = 'Low') {
    app.elements.taskInput.value = text;
    app.elements.priorityInput.value = priority;
    app.context.addTask();
}

function getTasks(app) {
    return vm.runInNewContext('tasks', app.context);
}

let passed = 0;
let failed = 0;

function test(name, callback) {
    try {
        callback();
        console.log(`PASS: ${name}`);
        passed++;
    } catch (error) {
        console.error(`FAIL: ${name}`);
        console.error(error.message);
        failed++;
    }
}

// TC01: Add a valid task
test('Adding a valid task', () => {
    const app = createApp();

    addTask(app, 'Complete assignment');

    assert.strictEqual(getTasks(app).length, 1);
    assert.strictEqual(
        getTasks(app)[0].text,
        'Complete assignment'
    );
    assert.strictEqual(app.elements.totalTasks.textContent, 1);
});

// TC02: Reject an empty task
test('Rejecting an empty task', () => {
    const app = createApp();

    addTask(app, '');

    assert.strictEqual(getTasks(app).length, 0);
    assert.strictEqual(
        app.alerts[0],
        'Please enter a task'
    );
});

// TC03: Reject whitespace-only input
test('Rejecting whitespace-only task input', () => {
    const app = createApp();

    addTask(app, '   ');

    assert.strictEqual(getTasks(app).length, 0);
    assert.strictEqual(
        app.alerts[0],
        'Please enter a task'
    );
});

// TC04: Store and display High priority
test('Adding a High priority task', () => {
    const app = createApp();

    addTask(app, 'Submit project', 'High');

    assert.strictEqual(getTasks(app)[0].priority, 'High');
    assert.ok(
        app.elements.taskList.children[0]
            .classes.includes('high-priority')
    );
});

// TC05: Complete a task
test('Completing a task', () => {
    const app = createApp();

    addTask(app, 'Study for exam');
    app.context.completeTask(0);

    assert.strictEqual(getTasks(app)[0].completed, true);
    assert.strictEqual(app.elements.completedTasks.textContent, 1);
    assert.strictEqual(app.elements.pendingTasks.textContent, 0);
    assert.ok(
        app.elements.taskList.children[0]
            .innerHTML.includes('Undo')
    );
});

// TC06: Undo task completion
test('Undoing a completed task', () => {
    const app = createApp();

    addTask(app, 'Study for exam');
    app.context.completeTask(0);
    app.context.completeTask(0);

    assert.strictEqual(getTasks(app)[0].completed, false);
    assert.strictEqual(app.elements.completedTasks.textContent, 0);
    assert.strictEqual(app.elements.pendingTasks.textContent, 1);
});

// TC07: Delete a task
test('Deleting a task', () => {
    const app = createApp();

    addTask(app, 'Temporary task');
    app.context.deleteTask(0);

    assert.strictEqual(getTasks(app).length, 0);
    assert.strictEqual(app.elements.totalTasks.textContent, 0);
    assert.strictEqual(app.elements.taskList.children.length, 0);
});

// TC08: Dashboard counts multiple tasks correctly
test('Updating dashboard counts', () => {
    const app = createApp();

    addTask(app, 'Task A');
    addTask(app, 'Task B', 'Medium');
    app.context.completeTask(0);

    assert.strictEqual(app.elements.totalTasks.textContent, 2);
    assert.strictEqual(app.elements.completedTasks.textContent, 1);
    assert.strictEqual(app.elements.pendingTasks.textContent, 1);
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
    process.exitCode = 1;
} else {
    console.log('All automated tests passed.');
}
