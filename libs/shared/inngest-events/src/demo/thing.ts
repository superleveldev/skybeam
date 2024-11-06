type ThingNavigated = {
  data: {
    someValue: number;
  };
};

export type ThingEvents = {
  'demo/thing.navigated': ThingNavigated;
};
