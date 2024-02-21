// 유저가 값을 입력한다
// +버튼 클릭시, 할일 추가됨
// delete버튼 클릭시, 할일 삭제됨
// check버튼 클릭시, 할일이 끝나고 밑줄쳐짐
// 1. check 버튼을 클릭하는 순간 false -> true
// 2. true이면 끝난걸로 간주하고 밑줄 보여주기
// 3. false이면 안끝난걸로 간주하고 그대로
// 진행중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남탭은 -> 끝난 아이템만, 진행중탭은 -> 진행중인 아이템만
// 전체탭누르면 -> 다시 전체아이템으로 돌아옴

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".tab-type div"); // querySelectorAll는 조건에 만족하는 모든 것을 가져온다는 것
let underLine = document.getElementById("underline");
let taskList = [];
let mode = "all";
let filterList = [];


taskInput.addEventListener("keyup", validate); //input 입력시 add버튼 활성화

// 처음부터 underline이 'all' 에 위치할 수 있도록 하는 함수
window.onload = function () {
  let initialTab = document.getElementById("all");
  underLine.style.opacity = "1";
  underLine.style.transition = "0.4s ease-in";
  underLine.style.top = "0";
  underLine.style.left = initialTab.offsetLeft + "px";
  underLine.style.width = initialTab.offsetWidth + "px";
  underLine.style.height = initialTab.offsetHeight + "px";
};

// 언더바 이벤트
tabs.forEach((menu) =>
  menu.addEventListener("click", (e) => underlineIndicator(e))
);

// enter 입력이벤트
taskInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault(); // 기본 엔터 키 동작을 무효화하여 새로운 줄이 추가되지 않도록 함
    addButton.click(); //  "add" 버튼 클릭 이벤트를 호출하여 엔터 키를 눌러도 클릭 된 것과 같게 함.
  }
});


addButton.addEventListener("click", addTask); // +버튼 눌렀을 때 활성화


for (let i = 1; i <= tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}


// add버튼 클릭 후 함수

function addTask() {
  let task = {
    taskContent: taskInput.value, //등록 할 할 일
    isComplete: false,
    id: randomIDGenerator(),
  };

  taskList.push(task);

  render();
  validate();
}







function render() {
  // 1. 내가 선택한 탭에 따라
  // 2. 리스트를 다르게 보여준다
  // all -> taskList / ongoing, done -> filterList
  let list = [];

  if (mode === "all") {
    list = taskList;
  } else if (mode === "ongoing" || mode === "done") {
    list = filterList;
  }

  
  let resultHTML = "";

  //할 일 생성했을 시, 나타내는 Tab

  for (let i = 0; i < list.length; i++) {
    //체크버튼 클릭했을 때
    if (list[i].isComplete === true) {
      resultHTML += `<div class="task task-done">
                  <div class ="check-box">
                    <button onclick="toggleComplete('${list[i].id}')"><i class="fas fa-undo-alt"></i></button>
                    <div class="task-done">${list[i].taskContent}
                  </div>
                  </div>

                  <div class="button-box">
                    <button onclick="editTask('${list[i].id}')"><i class="fa fa-light fa-pencil"></i></button>
                    <button onclick="deleteTask('${list[i].id}')"><i class="fa fa-trash"></i></button>
                  </div>
                  </div>`;
    } else {
      //체크버튼 클릭하지 않았을 때
      resultHTML += 
      `<div class= "task">
      <div class ="check-box">
      <button onclick="toggleComplete('${list[i].id}')"><i class="fa fa-duotone fa-check"></i></button>
      <div>${list[i].taskContent}
      </div>
      </div>
      <div class="button-box">
        <button onclick="editTask('${list[i].id}')"><i class="fa fa-light fa-pencil"></i></button>
        <button onclick="deleteTask('${list[i].id}')"><i class="fa fa-trash"></i></button>
      </div>
      </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHTML;
}




function toggleComplete(id) {
  // task tab들을 모두순회하며 id를비교
  // 클릭한 id와 일치하는 id를 찾으면
  // isComplete 상태를 반전시킨다 true -> false로
  // break은 반복문을 빠져나온다
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
}

function deleteTask(id) {

  // all내에 id를 찾아 삭제
  if (mode === "all") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].id === id) {
        taskList.splice(i, 1);
        break;
      }
    }
    console.log(taskList);
    render();
  } else if (mode === "ongoing" || mode === "done") {
    for (let i = 0; i < filterList.length; i++) {
      if (filterList[i].id === id) {
        filterList.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].id === id) {
        taskList.splice(i, 1);
        break;
      }
    }
  }
  render();

  // console.log(taskList); // 잘 동작하는지 console.log에서 체크
}


//filter 함수
function filter(event) {
  // console.log("filter", event.target.id); tabs의 모두, 진행중, 끝남 클릭 시 id 잘 들어오는지 확인
  mode = event.target.id;
  filterList = [];

  // all일때 -> 전체리스트를 보여준다 -> render를 보여주면 됨
  // ongoing일때 -> 진행중인 items를 보여준다 -> task.isComplete = false
  // done일때 -> 끝난 items를 보여준다 -> task.isComplete = true

  // 모두를 클릭시 나타나는 로직
  if (mode === "all") {
    render();

    //진행중 클릭시 나타나는 로직
  } else if (mode === "ongoing") {
    for (let i = 0; i < taskList.length; i++) {
      if (!taskList[i].isComplete) {
        filterList.push(taskList[i]);
      }
    }

    render();

    //끝남 클릭시 나타나는 로직
  } else if (mode === "done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete) {
        filterList.push(taskList[i]);
      }
    }
    render();
  }

  underlineIndicator(e); //underLine
}

// input입력시 add버튼 활성여부 함수
function validate() {
  if (taskInput.value == "") {
    addButton.disabled = true;
    alert("입력 값이 없습니다!");
  } else {
    addButton.disabled = false;
  }
}



// under-line 모양
function underlineIndicator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.height = e.currentTarget.offsetHeight + "px";
  underLine.style.opacity = "1";
  underLine.style.transition = "0.4s ease-in";
  underLine.style.top = "0";
}

//랜덤 Id 생성기
function randomIDGenerator() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

