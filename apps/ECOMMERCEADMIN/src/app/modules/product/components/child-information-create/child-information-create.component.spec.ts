import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildInformationCreateComponent } from './child-information-create.component';

describe('ChildInformationCreateComponent', () => {
  let component: ChildInformationCreateComponent;
  let fixture: ComponentFixture<ChildInformationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildInformationCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChildInformationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
