import Model from './Model';
import View from './View';
import Controller from './Controller';

const view = new View();
const model = new Model();
const controller = new Controller(view, model);
view.read();