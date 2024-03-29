import { useState } from "react";
import { useInput } from "../utils/hooks";
import Button from "../Button/Button";
import Input from "../Input";
import PropTypes from "prop-types";
import LoadingSpinner from "@assets/loading-spinner.svg";

const TaskForm = ({ props }) => {
  const {
    setActive,
    preventDefaultAction,
    handleCreateTask,
    activeCollection,
    isTaskEdit,
    setIsTaskEdit,
    activeTask,
    setActiveTask,
    handleEditTask,
  } = props;

  const [isCreationLoading, setIsCreationLoading] = useState(false);
  const [taskColor, setTaskColor] = useInput("#ffffff");
  const [taskName, setTaskName] = useInput("");
  const [taskDescription, setTaskDescription] = useInput("");
  const [newTaskDescription, setNewTaskDescription] = useInput("");

  const resetStates = () => {
    setTaskColor("#fff");
    setTaskName("");
    setTaskDescription("");
    setNewTaskDescription("");
    setActiveTask("");
    setIsCreationLoading(false);
    setIsTaskEdit(false);
    setActive(false);
  };

  const createTask = () => {
    setIsCreationLoading(true);
    handleCreateTask({
      collection_name: activeCollection,
      task_name: taskName.value,
      task_description: taskDescription.value,
      color_code: taskColor.value,
    });

    resetStates();
  };

  const editTaskDescription = () => {
    handleEditTask({
      task_name: activeTask,
      new_task_description: newTaskDescription.value,
    });
    resetStates();
  };

  return (
    <form
      className="form task-form"
      onSubmit={(e) => preventDefaultAction(e)}
      onClick={(e) => e.stopPropagation()}
    >
      {isTaskEdit ? (
        <>
          <div className="form-header">
            <p>Taskman - Edit Task</p>
          </div>
          <Input
            required
            name="new-task-description"
            title="New Task Description"
            type="text"
            {...newTaskDescription}
          />
        </>
      ) : (
        <>
          <div className="form-header">
            <p>Taskman Task</p>
          </div>
          <Input
            required
            name="task_color"
            title="Color"
            type="color"
            {...taskColor}
          />
          <Input
            required
            name="task-name"
            title="Task Name"
            type="text"
            {...taskName}
          />
          <Input
            required
            name="task-description"
            title="Task Description"
            type="text"
            {...taskDescription}
          />
        </>
      )}
      <div className="action-buttons-container">
        <Button type="cancel" text="Cancel" onClick={() => setActive(false)} />
        <Button
          onClick={isTaskEdit ? editTaskDescription : createTask}
          type="confirm"
          text={
            isCreationLoading ? (
              <img className="spinner" src={LoadingSpinner}></img>
            ) : isTaskEdit ? (
              "Edit"
            ) : (
              "Create"
            )
          }
        />
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  props: PropTypes.object,
  setActive: PropTypes.func,
  preventDefaultAction: PropTypes.func,
  handleCreateTask: PropTypes.func,
  activeCollection: PropTypes.string,
  isTaskEdit: PropTypes.bool,
  setIsTaskEdit: PropTypes.func,
  activeTask: PropTypes.string,
  setActiveTask: PropTypes.func,
  handleEditTask: PropTypes.func,
};

export default TaskForm;
