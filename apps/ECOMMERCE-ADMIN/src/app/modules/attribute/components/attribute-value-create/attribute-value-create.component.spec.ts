import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeValueCreateComponent } from './attribute-value-create.component';

describe('AttributeValueCreateComponent', () => {
  let component: AttributeValueCreateComponent;
  let fixture: ComponentFixture<AttributeValueCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeValueCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeValueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
