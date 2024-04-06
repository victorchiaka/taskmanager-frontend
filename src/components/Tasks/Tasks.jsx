import styles from "./Tasks.module.css";
import back from "@assets/back.svg";
import Task from "./Task";
import PropTypes from "prop-types";
import { getCollectionTasksRequest } from "../../services/api";
import { useEffect, useState } from "react";
import { getCollectionStatisticsRequest } from "../../services/api";
import AddTaskModal from "../Modals/AddTaskModal";
import createTokenProvider, { createAuthProvider } from "../utils/tokens";
import { useToast } from "../utils/hooks";

const TasksInstanceAction = ({ props }) => {
  const { collection, setDisplayTasksOptions, setActiveCollection } = props;

  const { getToken } = createTokenProvider();

  const [collectionStatistics, setCollectionStatistics] = useState({
    all: 0,
    completed: 0,
  });

  const preventDefaultAction = (e) => {
    e.preventDefault();
  };

  const addTaskModalProps = {
    activeCollection: collection.collection_name,
    preventDefaultAction: preventDefaultAction,
  };

  const handleGetCollectionStatisticsRequest = async () => {
    let accessToken = await getToken().then((res) => res);

    const data = {
      collection_name: collection.collection_name,
    };

    getCollectionStatisticsRequest(accessToken, data).then((res) => {
      const stats = res["stats"];
      setCollectionStatistics({
        all: stats["overall_count"],
        completed: stats["completed_count"],
      });
    });
  };

  useEffect(() => {
    handleGetCollectionStatisticsRequest();

    const interval = setInterval(() => {
      handleGetCollectionStatisticsRequest();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.instanceAction}>
      <div className={styles.tasksAction}>
        <span
          onClick={() => {
            setActiveCollection("");
            setDisplayTasksOptions({
              display: false,
              collection: {},
            });
          }}
          className="back-button"
        >
          <img src={back} />
          Back
        </span>
        &nbsp; <h4>{collection.collection_name}</h4>
      </div>
      <AddTaskModal props={addTaskModalProps} />
      <div className={styles.tasksInfo}>
        <div>All: {collectionStatistics.all}</div>
        <div>Completed: {collectionStatistics.completed}</div>
      </div>
    </div>
  );
};

const Tasks = ({ props }) => {
  const { collection, setDisplayTasksOptions, setActiveCollection } = props;
  const { getToken } = createTokenProvider();

  const { logout } = createAuthProvider();
  const [tasks, setTasks] = useState([]);
  const showToast = useToast();

  const handleGetCollectionTasks = async () => {
    let accessToken = await getToken().then((res) => res);

    const data = { collection_id: collection.id };
    getCollectionTasksRequest(accessToken, data)
      .then((res) => setTasks(res["tasks"]))
      .catch((rej) => {
        if (rej["message"] === "Invalid token") {
          showToast.info("Session expired, please log in again");
          logout();
        }
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetCollectionTasks();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const taskInstanceOptionProps = {
    collection: collection,
    setDisplayTasksOptions: setDisplayTasksOptions,
    setActiveCollection: setActiveCollection,
  };

  return (
    <>
      <TasksInstanceAction props={taskInstanceOptionProps} />
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </>
  );
};

TasksInstanceAction.propTypes = {
  props: PropTypes.object,
  collection: PropTypes.object,
  setDisplayTasksOptions: PropTypes.func,
  setTaskFormActive: PropTypes.func,
  setActiveCollection: PropTypes.func,
};

Tasks.propTypes = {
  props: PropTypes.object,
  collection: PropTypes.object,
  setDisplayTasksOptions: PropTypes.func,
  setTaskFormActive: PropTypes.func,
  setActiveCollection: PropTypes.func,
  setIsTaskEdit: PropTypes.func,
  setActiveTask: PropTypes.func,
};

export default Tasks;
