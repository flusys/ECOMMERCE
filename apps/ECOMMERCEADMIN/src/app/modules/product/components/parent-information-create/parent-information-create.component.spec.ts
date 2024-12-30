import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentInformationCreateComponent } from './parent-information-create.component';

describe('ParentInformationCreateComponent', () => {
  let component: ParentInformationCreateComponent;
  let fixture: ComponentFixture<ParentInformationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentInformationCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentInformationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
