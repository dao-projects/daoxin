import { DefaultOptons, Options, Trackerversion } from "./../type/index";
export default class Tracker {
  private data: Options;
  private histroryType: Partial<keyof History>[];
  //dom监听的事件列表
  private eventList: string[] = [
    "click",
    "dblclick",
    "contextmenu",
    "mousedown",
    "mouseup",
    "mouseenter",
    "mouseout",
    "mouseover",
  ];

  public constructor(options: Options) {
    this.histroryType = ["pushState", "replaceState"];
    this.data = Object.assign(this.initConfig(), options); //初始化配置对象
    this.installExtra();
  }

  //dom上报
  private domTracker() {
    this.eventList.forEach((item) => {
      window.addEventListener(item, (e) => {
        let element = e.target as HTMLElement;
        let isTarget = element.getAttribute("target-key");
        if (isTarget) {
          this.sendData({ type: "dom" });
        }
      });
    });
  }

  //js错误上报
  private jsError() {
    //1.脚本错误，资源错误
    window.addEventListener(
      "error",
      (e) => {
        e.preventDefault();
        const isErrorEvent: boolean = e instanceof ErrorEvent;
        if (!isErrorEvent) {
          //资源错误
          this.sendData({ type: "resource", msg: e.message });
          return;
        }
        this.sendData({ type: "js", msg: e.message });
      },
      true,
    );
    //2.promise错误
    window.addEventListener(
      "unhandledrejection",
      (e: PromiseRejectionEvent) => {
        e.preventDefault();
        e.promise.catch((error) => {
          let msg = error?.message || error;
          this.sendData({ type: "promise", msg });
        });
      },
    );
  }

  // 白屏上报
  private whiteScreenTracker() {
    // 使用Performance API来检测FCP
    if ("performance" in window && "getEntriesByType" in performance) {
      const paintEntries = performance.getEntriesByType("paint");
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint",
      );

      if (fcp) {
        const thresholdMs = 3000; // 假设超过3秒认为是白屏
        if (fcp.startTime > thresholdMs) {
          this.sendData({
            type: "whiteScreen",
            duration: fcp.startTime,
            msg: "Possible White Screen Detected",
          });
        }
      }
    } else {
      console.warn("Performance API not supported in this browser.");
    }
  }

  //数据上报（
  private sendData<T>(data: T) {
    try {
      const params = Object.assign({}, data, { time: Date.now() });
      let blob = new Blob([JSON.stringify(params)], {
        type: "application/x-www-form-urlencoded",
      });
      navigator.sendBeacon(this.data.requestUrl, blob);
    } catch (error) {
      console.error("Error sending beacon:", error);
    }
  }

  //定制功能
  public installExtra() {
    //history
    if (this.data.historyTracker) {
      this.histroryType.forEach((item: keyof History) => {
        let origin = history[item];
        let eventHistory = new Event(item);
        (window.history[item] as any) = function (this: any) {
          origin.apply(this, arguments);
          window.dispatchEvent(eventHistory);
        };
        window.addEventListener(item, () => {
          this.sendData({ type: "history", msg: item });
        });
      });
    }
    //hash
    if (this.data.hashTracker) {
      window.addEventListener("hashchange", (e) => {
        this.sendData({ type: "hash", msg: e });
      });
    }
    //dom手动上报
    if (this.data.domTracker) {
      this.domTracker();
    }
    //jsError
    if (this.data.jsError) {
      this.jsError();
    }
    // 白屏
    if (this.data.whiteScreen) {
      this.whiteScreenTracker();
    }
  }

  //初始化配置项
  private initConfig(): DefaultOptons {
    return <DefaultOptons>{
      sdkVersion: Trackerversion.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
      whiteScreen: false
    };
  }
}
