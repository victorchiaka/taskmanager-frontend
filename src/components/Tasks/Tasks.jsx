import styles from "./Tasks.module.css";
import back from "@assets/back.svg";
import add from "@assets/add.svg";
import Task from "./Task";
import PropTypes from "prop-types";

// Dummy data for development
import { data } from "./data";

const TasksInstanceAction = ({ collection, setDisplayTaskOptions }) => {
  return (
    <div className={styles.instanceAction}>
      <div className={styles.tasksAction}>
        <span
          onClick={() =>
            setDisplayTaskOptions({
              display: false,
              collection: "",
            })
          }
          className="back-button"
        >
          <img src={back} />
          Back
        </span>
        &nbsp; <h4>{collection.collection_name}</h4>
      </div>
      <div className={styles.addTask}>
        <img src={add} /> Add Task
      </div>
      <div className={styles.tasksInfo}>
        <div>All {collection.task_count}</div>
        <div>Completed 0</div>
      </div>
    </div>
  );
};

const Tasks = ({ collection, setDisplayTaskOptions }) => {
  return (
    <>
      <TasksInstanceAction
        collection={collection}
        setDisplayTaskOptions={setDisplayTaskOptions}
      />
      <div className={styles.tasks}>
        {data.tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </>
  );
};

TasksInstanceAction.propTypes = {
  collection: PropTypes.object,
  setDisplayTaskOptions: PropTypes.func,
};

Tasks.propTypes = {
  collection: PropTypes.object,
  setDisplayTaskOptions: PropTypes.func,
};

export default Tasks;
