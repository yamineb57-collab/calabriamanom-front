import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuManaement } from './menu-management';

describe('MenuManaement', () => {
  let component: MenuManaement;
  let fixture: ComponentFixture<MenuManaement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuManaement],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuManaement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
