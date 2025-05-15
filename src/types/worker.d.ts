declare module "*.worker.ts" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

declare module "*.worker.ts" {
  const worker: new () => Worker;
  export default worker;
}
