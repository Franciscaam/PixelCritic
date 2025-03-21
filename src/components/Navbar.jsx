import React from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { HomeOutlined, FireOutlined, HeartOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebaseConfig";
import "../style/global.css";

const Navbar = () => {
  const [user] = useAuthState(auth);

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={logout}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">PixelCritic</Link>
      </div>

      <Menu mode="horizontal" className="navbar-menu">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Inicio</Link>
        </Menu.Item>
        <Menu.Item key="populares" icon={<FireOutlined />}>
          <Link to="/populares">Populares</Link>
        </Menu.Item>
        <Menu.Item key="wishlist" icon={<HeartOutlined />}>
          <Link to="/wishlist">Wishlist</Link>
        </Menu.Item>
      </Menu>

      <div className="navbar-user">
        {user ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="user-info">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="User"
                className="user-avatar"
              />
              <span className="user-name">{user.displayName || "Usuario"}</span>
            </div>
          </Dropdown>
        ) : (
          <Link to="/login" className="login-btn">
            Iniciar sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
