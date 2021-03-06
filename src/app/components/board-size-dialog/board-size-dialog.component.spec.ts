import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSizeDialogComponent } from './board-size-dialog.component';

describe('BoardSizeDialogComponent', () => {
  let component: BoardSizeDialogComponent;
  let fixture: ComponentFixture<BoardSizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSizeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
