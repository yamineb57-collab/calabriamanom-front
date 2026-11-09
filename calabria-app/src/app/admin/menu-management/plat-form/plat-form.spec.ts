import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatForm } from './plat-form';

describe('PlatForm', () => {
  let component: PlatForm;
  let fixture: ComponentFixture<PlatForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
