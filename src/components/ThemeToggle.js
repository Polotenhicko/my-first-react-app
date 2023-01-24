import React from 'react';
import { ThemeContext } from '../theme-context';
import { SvgMoon } from '../assets/icons/SvgMoon';
import { SvgSun } from '../assets/icons/SvgSun';

export class ThemeToggle extends React.Component {
  static contextType = ThemeContext;

  componentDidMount() {
    this.props.onChangeTheme(this.context);
  }

  handleClickTheme = () => {
    const nextTheme = this.context == 'dark' ? 'light' : 'dark';
    this.props.onChangeTheme(nextTheme);
  };

  render() {
    const ThemeSvg = this.context == 'dark' ? SvgMoon : SvgSun;
    return (
      <div className="theme-toggle" onClick={this.handleClickTheme}>
        <div className="theme-toggle-wrapper">
          <ThemeSvg />
        </div>
      </div>
    );
  }
}
