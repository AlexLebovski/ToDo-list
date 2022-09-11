const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')

let tasks = []

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  tasks.forEach((task) => renderTask(task))
}

checkEmptyList()
form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

// Функции
function addTask(e) {
  // Отмена перезагрузки браузера
  e.preventDefault()

  // Описываем задачу в виде объекта
  const newTask = {
    id: Math.random(),
    text: taskInput.value,
    done: false,
  }

  // Добавляем задачу в массив с задачами ////
  tasks.push(newTask)

  saveToLocalStorage()

  renderTask(newTask)

  taskInput.value = ''
  taskInput.focus()

  checkEmptyList()
}

function deleteTask(e) {
  // Не реагируем на клик кроме кнопки "delete"
  if (e.target.dataset.action !== 'delete') return

  // Записываем родителя кнопки "delete"
  const parentNode = e.target.closest('.task-item')

  // Определяем ID задачи ////
  const id = Number(parentNode.id)

  // Находим индекс задачи в массиве ////
  const index = tasks.findIndex((task) => task.id === id)

  // Удаление задачи из массива
  tasks.splice(index, 1)

  saveToLocalStorage()

  // Удаляем задачу
  parentNode.remove()

  checkEmptyList()
}

function doneTask(e) {
  // Не реагируем на клик кроме кнопки "done"
  if (e.target.dataset.action !== 'done') return

  // Записываем родителя кнопки "done"
  const parentNode = e.target.closest('.task-item')

  // Получаем id задачи ////
  const id = Number(parentNode.id)
  const task = tasks.find((task) => task.id === id)
  task.done = !task.done

  saveToLocalStorage()

  // Находим текст
  const taskTitle = parentNode.querySelector('.task-title')

  // Добавляем класс "Выполнено"
  taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
      <li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
      </li>
    `

    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList')

    emptyListEl ? emptyListEl.remove() : null
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask (task) {
    // Создаём структуру HTML
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${task.done ? "task-title task-title--done" : "task-title"}">${task.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>
  `

  // Добавляем задачу в разметку
  tasksList.insertAdjacentHTML('beforeend', taskHTML)
}