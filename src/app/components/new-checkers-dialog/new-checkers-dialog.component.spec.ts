import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCheckersDialogComponent } from './new-checkers-dialog.component';

describe('BoardSizeDialogComponent', () => {
  let component: NewCheckersDialogComponent;
  let fixture: ComponentFixture<NewCheckersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCheckersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCheckersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
