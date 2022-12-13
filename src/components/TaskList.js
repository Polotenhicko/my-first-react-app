import { TaskItem } from './TaskItem';

export function TaskList(props) {
  const taskArray = props.taskArray.map((taskObj) => (
    <TaskItem
      key={taskObj.id}
      taskObj={taskObj}
      onCompleteTask={props.onCompleteTask}
      onDeleteTask={props.onDeleteTask}
    />
  ));
  return <ul className="task-list">{taskArray}</ul>;
}
