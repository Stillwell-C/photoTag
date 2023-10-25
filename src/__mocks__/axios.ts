
const exampleMapData = {
  data: {
    _id: "652f650570b6a54dd23f2f29",
    mapName: "Ski Slope",
    imgKey: "h4nm4gu6clhqbrn27vfw.jpg",
    coordinates: {
      odlawMaxX: { $numberDouble: "32.5" },
      odlawMaxY: { $numberDouble: "41.5" },
      odlawMinX: { $numberInt: "31" },
      odlawMinY: { $numberDouble: "39.45" },
      waldoMaxX: { $numberDouble: "87.5" },
      waldoMaxY: { $numberDouble: "49.2" },
      waldoMinX: { $numberDouble: "83.6" },
      waldoMinY: { $numberDouble: "44.8" },
      wendaMaxX: { $numberDouble: "49.5" },
      wendaMaxY: { $numberDouble: "28.15" },
      wendaMinX: { $numberInt: "48" },
      wendaMinY: { $numberDouble: "25.5" },
      whitebeardMaxX: { $numberInt: "9" },
      whitebeardMaxY: { $numberDouble: "49.5" },
      whitebeardMinX: { $numberInt: "6" },
      whitebeardMinY: { $numberDouble: "46.75" },
    },
  }};

  const exampleFrontPageData = {
    data: [
      {
        _id: "652f650570b6a54dd23f2f29",
        mapName: "Ski Slope",
        imgKey: "h4nm4gu6clhqbrn27vfw.jpg",
      },
      {
        _id: "652f650570b6a54dd23f2f28",
        mapName: "Ski Slope",
        imgKey: "h4nm4gu6clhqbrn27vfw.jpg",
      },
      {
        _id: "652f650570b6a54dd23f2f27",
        mapName: "Ski Slope",
        imgKey: "h4nm4gu6clhqbrn27vfw.jpg",
      },
      {
        _id: "652f650570b6a54dd23f2f26",
        mapName: "Ski Slope",
        imgKey: "h4nm4gu6clhqbrn27vfw.jpg",
      },
    ],
  };

export default {
    create: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve()),
      post: jest.fn(() => Promise.resolve())
    }))
    }