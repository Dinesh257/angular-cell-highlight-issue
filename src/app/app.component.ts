import { Component, ViewChild } from '@angular/core';
import { DataSvcService } from "./data-svc.service";
import { CollectionView } from 'wijmo/wijmo';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data : CollectionView;
  filter;
    @ViewChild('grid') jsonFlex: wjcGrid.FlexGrid;

  constructor(private dataSvc: DataSvcService) {
    this.data = this.dataSvc.getTreeData();
  }

  init(grid) {
    //some initializzation work for grid
    let map = [
      {key: 'city', display: 'CITY'},
      {key: 'state', display: 'STATE'},
    ];
    grid.columns[1].dataMap = new wjcGrid.DataMap(map, 'key', 'display');
    // applied dataMap refresh filtershow values
    this.updateFilterShowValues(this.filter);
  }

   reload(){
      this.data = new CollectionView([]);
      this.data = new CollectionView(this.dataSvc.getTreeData());
      this.jsonFlex.refresh();

    }

  initFilter(filter) {
    // save filter instance for later use
    this.filter = filter;
    let fil = filter.getColumnFilter('name');
    fil.valueFilter.uniqueValues = ['Seattle', 'Spokane'];

      this.updateFilterShowValues(filter);
      this.makeFilterHierarchical(filter, true);
  }

  updateFilterShowValues(filter){
    let filterColBindings = filter.filterColumns;

    if (!filterColBindings || !filterColBindings.length) {
      filterColBindings = filter.grid.columns.map(col => col.binding);
    }

    filterColBindings.forEach(colBind => {
      let vals = this.getUniqueColValues(filter.grid, colBind);
      let fil = filter.getColumnFilter(colBind);
      if(fil && fil.valueFilter){
        fil.valueFilter.uniqueValues = vals;
      }
    });
  }

  getUniqueColValues(grid, colBind){
    let col = grid.columns.getColumn(colBind);
    if(!col){
      return null;
    }else if(col.dataMap && col.dataMap.getDisplayValues){
        return col.dataMap.getDisplayValues();
    }

    let uniquesVals = [];
    this.fillUniqueValues(uniquesVals,grid.collectionView.sourceCollection, col.binding, grid.childItemsPath);

    return uniquesVals;
  }

  fillUniqueValues(uVals, list, binding, childsPath?){
    list.forEach(item => {
      if(childsPath && item[childsPath] && item[childsPath].length){
        this.fillUniqueValues(uVals, item[childsPath], binding, childsPath);
      }
      if(item[binding] !== undefined && uVals.indexOf(item[binding]) < 0){
        uVals.push(item[binding]);
      }
    });
  }

  makeFilterHierarchical(filter, showChildRowsIfParentPassesFilter?){
    filter.filterApplied.addHandler((s, e) => {
      filter.grid.collectionView.filter = null;
    });

    filter.grid.collectionView.collectionChanged.addHandler((s,e)=>{
      this.updateRowsVisibility(filter);
    });

    filter['_showChildRowsForVisibleParent'] = showChildRowsIfParentPassesFilter? true: false;
  }

  updateRowsVisibility(filter) {
    var rows = filter.grid.rows;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i],
        state = row.dataItem,
        rng = row.getCellRange();

      // handle (level 0)  
      if (row.level == 0) {
        this.updateGroupVisibility(filter.grid, filter, row.getCellRange());
        i = rng.bottomRow;
      }
    }
  }

  updateGroupVisibility(grid, filter, rng) {
    let root = grid.rows[rng.topRow];
    let rootVisible = this.checkDataItemPassFilter(grid, filter, root.dataItem);
    let childVisible = false;

    let showChildRowsIfParentPassesFilter = filter['_showChildRowsForVisibleParent']? true: false;
    if(rootVisible && showChildRowsIfParentPassesFilter){
      // it does, so show all its items(optional)
      for (let j = rng.topRow + 1; j <= rng.bottomRow; j++) {
        this.setRowVisibility(grid, j, true, true);
      }
    }
    else if(!rootVisible || !showChildRowsIfParentPassesFilter){
      // update child rows
      // it does not, so check child items
      for (let j = rng.topRow + 1; j <= rng.bottomRow; j++) {
        let childRow = grid.rows[j];
        let tempChildVisible;
        if(childRow.hasChildren){
          let cRng = childRow.getCellRange();
          tempChildVisible = this.updateGroupVisibility(grid, filter, cRng);
          j = cRng.bottomRow;
        }else{
          tempChildVisible = this.checkDataItemPassFilter(grid, filter, childRow.dataItem);
        }
        //
        this.setRowVisibility(grid, j, tempChildVisible, false);
        childVisible = childVisible || tempChildVisible;
      }
    }

    this.setRowVisibility(grid, root.index, rootVisible || childVisible, false);

    return rootVisible || childVisible;

  }

  setRowVisibility(grid, rowIndex, visibility, shouldUpdateChildRows?){
    let row = grid.rows[rowIndex];
    // set row vsible
    row.visible = visibility;

    // if shouldUpdateChildRows
    if(shouldUpdateChildRows && row.hasChildren){
      let rowRange = row.getCellRange();
      for(let i = rowRange.topRow + 1; i <= rowRange.bottomRow; i++){
        this.setRowVisibility(grid, i, visibility, shouldUpdateChildRows);
      }
    }
  }

  checkDataItemPassFilter(grid, filter, item) {
    let filterColBindings = filter.filterColumns;

    if (!filterColBindings || !filterColBindings.length) {
      filterColBindings = grid.columns.map(col => col.binding);
    }

    for (let i = 0; i < filterColBindings.length; i++){
      let colbind = filterColBindings[i];
      let colFil = filter.getColumnFilter(colbind);
      
      // fails column filter return false
      if(colFil && !colFil.apply(item)){
        return false;
      }
    }

    // passes all filter, return true
    return true;
  }

}
