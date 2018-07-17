const INITIAL_STATE = {
  visited: false
};

export const FINISHED_READ_INTRODUCTION = "FINISHED_READ_INTRODUCTION";

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FINISHED_READ_INTRODUCTION:
      return {
        visited: true
      };
    default:
      return state;
  }
};

export const finishedReadIntroduction = () => ({
  type: FINISHED_READ_INTRODUCTION
});
