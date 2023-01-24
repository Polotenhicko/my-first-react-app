import ErrorBoundary from './ErrorBoundary';
import { TaskItem } from './TaskItem';

export function TaskList(props) {
  const slotError = (
    <div className="error">
      <h2>Произошла ошибка!</h2>
    </div>
  );
  const taskArray = props.taskArray.map((taskObj) => (
    <TaskItem
      key={taskObj.id}
      taskObj={taskObj}
      onCompleteTask={props.onCompleteTask}
      onDeleteTask={props.onDeleteTask}
    />
  ));
  return (
    <ErrorBoundary slotError={slotError} onDeleteTask={props.onDeleteTask}>
      <ul className="task-list">{taskArray}</ul>
    </ErrorBoundary>
  );
}
