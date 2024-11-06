type EntityClicked = {
  data: {
    name: string;
  };
};

export type EntityEvents = {
  'demo/entity.clicked': EntityClicked;
};
