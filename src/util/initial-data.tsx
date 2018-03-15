export default [{
  intervals: [{
    start: 0,
    end: 60 * 5 * 10,
    type: 'type-1',
    id: '4d0e5ae6-7b7c-4075-bb70-4d1197764190'
  }, {
    start: 60 * 5 * 15,
    end: 60 * 5 * 35,
    type: 'type-2',
    id: 'c3d34622-8db5-4d18-ae84-02cd03bccb2e'
  }],
  id: 'c3d34622-8db5-4d18-ae84-02cd03bccb2e'
},
{
  intervals: [{
    start: 60 * 5 * 5,
    end: 60 * 5 * 15,
    type: 'type-1',
    id: '4d0e5ae6-7b7c-4075-bb70-4d1197764190'
  }, {
    start: 60 * 5 * 20,
    end: 60 * 5 * 40,
    type: 'type-2',
    id: 'c3d34622-8db5-4d18-ae84-02cd03bccb2e'
  }],
  id: '29f8b72f-3c65-4b99-a636-2c83692825b2'
},
{
  intervals: [{
    start: 60 * 5 * 15,
    end: 60 * 5 * 35,
    type: 'type-1',
    id: '4d0e5ae6-7b7c-4075-bb70-4d1197764190'
  }, {
    start: 60 * 5 * 50,
    end: 60 * 5 * 80,
    type: 'type-2',
    id: 'c3d34622-8db5-4d18-ae84-02cd03bccb2e'
  }],
  id: '2728ef3b-d314-4aa1-be2c-327fd3227c3d'
},
...Array(200).fill(1).map((a, index) => {
  return {
    intervals: [{
      start: 60 * 5 * 5,
      end: 60 * 5 * 15,
      type: 'type-1',
      id: '4d0e5ae6-7b7c-4075-bb70-4d1197764190'
    }, {
      start: 60 * 5 * 20,
      end: 60 * 5 * 40,
      type: 'type-2',
      id: 'c3d34622-8db5-4d18-ae84-02cd03bccb2e'
    }],
    id: '5c33177a-936a-469d-922f-239514c9935' + index
  };
})] as any;
